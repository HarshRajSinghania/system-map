"""Round trips with the installed Kiro Crew, so the gateway's signing and this app's checks can't drift apart.

Criterion 6: the host signs and the real backend checks. Criterion 7: `tests/helpers.py` signs and the
host checks. The host's code runs through `host_run`, so with no Kiro Crew installed each test skips.
"""
import json
import sys
import tempfile
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from helpers import PROXY_SECRET, principal_claim, proxy_signature, proxy_v2  # noqa: E402
from test_backend import Served  # noqa: E402
from test_contract import host_run  # noqa: E402

#: The host signs one request and prints the three headers a gateway would send for it.
SIGN = (
    "import json, sys, time\n"
    "from kiro_crew.apps.proxy_auth import new_proxy_nonce, sign_proxy_principal_claim, sign_proxy_request_v2\n"
    "secret, kind, method, target, body, age = sys.argv[1:7]\n"
    "now = time.time() - int(age)\n"
    "nonce = new_proxy_nonce()\n"
    "owner = 'owner-1' if kind == 'owner-session' else ''\n"
    "print(json.dumps({\n"
    "    'X-KiroCrew-Proxy-Nonce': nonce,\n"
    "    'X-KiroCrew-Proxy-V2': sign_proxy_request_v2(secret=secret, ts=int(time.time()), nonce=nonce, method=method, target=target, body=body.encode()),\n"
    "    'X-KiroCrew-Principal': sign_proxy_principal_claim(kind=kind, owner_id=owner, method=method, target=target, body=body.encode(), secret=secret, now=now),\n"
    "}))\n"
)

#: The host checks the headers `tests/helpers.py` made. Each verifier gets its own replay cache.
VERIFY = (
    "import json, sys\n"
    "from kiro_crew.apps.proxy_auth import ProxyPrincipalReplayCache, verify_proxy_principal_claim, verify_proxy_request, verify_proxy_request_v2\n"
    "secret, method, target, body, v1, nonce, v2, claim = sys.argv[1:9]\n"
    "same = dict(method=method, target=target, body=body.encode(), secret=secret)\n"
    "found = verify_proxy_principal_claim(claim, replay_cache=ProxyPrincipalReplayCache(), **same)\n"
    "print(json.dumps({\n"
    "    'v1': verify_proxy_request(v1, **same),\n"
    "    'v2': verify_proxy_request_v2(v2, nonce, replay_cache=ProxyPrincipalReplayCache(), **same),\n"
    "    'kind': found.kind if found else None,\n"
    "}))\n"
)


def host_signs(kind: str, method: str, target: str, body: str = "", age: int = 0) -> dict[str, str]:
    """The headers the host's own signers make for this request, with the claim issued `age` seconds ago."""
    return json.loads(host_run(SIGN, PROXY_SECRET, kind, method, target, body, str(age)))


class HostSignsBackendChecks(Served):
    """Criterion 6: a request the host signed reaches the real backend, which checks it as the gateway's."""

    @classmethod
    def setUpClass(cls):
        host_run("import kiro_crew.apps.proxy_auth")  # skips here when there is no host
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.data = base / "data"
        cls.folder = base / "folder"
        cls.folder.mkdir()
        cls.serve()

    def send(self, headers: dict[str, str], target: str) -> int:
        request = urllib.request.Request(self.url(target), headers=headers, method="GET")
        try:
            with urllib.request.urlopen(request, timeout=10) as reply:
                reply.read()
                return reply.status
        except urllib.error.HTTPError as error:
            error.close()
            return error.code

    @property
    def target(self) -> str:
        # A person route that only lists a folder inside the temp area.
        return f"/browse?path={quote(str(self.folder))}"

    def test_an_owner_session_on_a_person_route_gets_200(self):
        self.assertEqual(self.send(host_signs("owner-session", "GET", self.target), self.target), 200)

    def test_an_agent_tool_on_the_same_route_gets_403(self):
        self.assertEqual(self.send(host_signs("agent-tool", "GET", self.target), self.target), 403)

    def test_the_same_request_sent_again_is_refused(self):
        headers = host_signs("owner-session", "GET", self.target)
        self.assertEqual(self.send(headers, self.target), 200)
        self.assertEqual(self.send(headers, self.target), 401)

    def test_a_claim_issued_61_seconds_ago_is_refused(self):
        self.assertEqual(self.send(host_signs("owner-session", "GET", self.target, age=61), self.target), 403)


class SystemMapSignsHostChecks(unittest.TestCase):
    """Criterion 7: headers from `tests/helpers.py` pass the host's own verifiers."""

    METHOD, TARGET, BODY = "POST", "/plan-status", '{"id": "a", "status": "done"}'

    def headers(self, body: str) -> list[str]:
        data, nonce = body.encode(), "0123456789abcdef0123456789abcdef"
        return [
            proxy_signature(self.METHOD, self.TARGET, data),
            nonce,
            proxy_v2(self.METHOD, self.TARGET, data, nonce),
            principal_claim("owner-session", self.METHOD, self.TARGET, data),
        ]

    def verdicts(self, body: str, signed_body: str) -> dict:
        return json.loads(host_run(VERIFY, PROXY_SECRET, self.METHOD, self.TARGET, body, *self.headers(signed_body)))

    def test_the_host_accepts_v1_v2_and_the_principal_claim(self):
        self.assertEqual(self.verdicts(self.BODY, self.BODY), {"v1": True, "v2": True, "kind": "owner-session"})

    def test_the_host_refuses_a_body_changed_by_one_byte(self):
        changed = self.BODY.replace("done", "dane")
        self.assertEqual(self.verdicts(changed, self.BODY), {"v1": False, "v2": False, "kind": None})


if __name__ == "__main__":
    unittest.main()
