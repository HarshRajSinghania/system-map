import email.message
import http.client
import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from backend import server  # noqa: E402
from core import agent_drafts, store  # noqa: E402
from helpers import PROXY_SECRET, commit_all, git, proxy_signature, proxy_v2, signed_request  # noqa: E402
from test_agent_drafts import EVIDENCE  # noqa: E402
from test_agents import FILES, SETTINGS  # noqa: E402


class Served(unittest.TestCase):
    """Run the real backend process on `cls.data` and call it over HTTP, signed as the gateway does."""

    #: What the gateway puts in an app backend's environment. A class can change it.
    gateway_env = {
        "KIROCREW_PROXY_SECRET": PROXY_SECRET,
        "KIROCREW_SPAWNED": "1",
        "KIROCREW_APP_NAME": "system-map",
        "KIROCREW_SPAWN_INSTANCE": "test",
    }
    #: Variables a test sets itself, never inherited from the shell running the tests.
    OWNED = ("KIROCREW_PROXY_SECRET", "KIROCREW_SPAWNED", "KIROCREW_APP_NAME", "KIROCREW_SPAWN_INSTANCE", "SYSTEM_MAP_UNSIGNED")

    @classmethod
    def serve(cls):
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            cls.port = probe.getsockname()[1]
        env = {k: v for k, v in os.environ.items() if k not in cls.OWNED}
        cls.server = subprocess.Popen(
            [sys.executable, str(ROOT / "backend" / "server.py")],
            env={**env, **cls.gateway_env, "PORT": str(cls.port), "SYSTEM_MAP_DATA": str(cls.data), "PYTHONDONTWRITEBYTECODE": "1"},
        )
        deadline = time.time() + 10
        while time.time() < deadline:
            try:
                cls.raw("/health")
                return
            except OSError:
                time.sleep(0.05)
        raise RuntimeError("backend did not start")

    @classmethod
    def tearDownClass(cls):
        cls.server.terminate()
        cls.server.wait(timeout=5)
        cls._tmp.cleanup()

    @classmethod
    def url(cls, path):
        return f"http://127.0.0.1:{cls.port}{path}"

    @classmethod
    def raw(cls, path, data=None, headers=None, method=None):
        """Call with no signature unless `headers` carries one."""
        request = urllib.request.Request(cls.url(path), data=data, headers=headers or {}, method=method)
        with urllib.request.urlopen(request, timeout=5) as reply:
            return json.load(reply)

    @classmethod
    def get(cls, path):
        with urllib.request.urlopen(signed_request(cls.url(path)), timeout=5) as reply:
            return json.load(reply)

    def post(self, path, body):
        return urllib.request.urlopen(signed_request(self.url(path), json.dumps(body).encode()), timeout=30)

    def status(self, path, data=None, headers=None, method=None):
        """The HTTP status of an unsigned call, or of one signed by `headers`."""
        try:
            self.raw(path, data, headers, method)
            return 200
        except urllib.error.HTTPError as error:
            return error.code


class BackendTests(Served):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.repo = base / "repo"
        (cls.repo / "supabase" / "migrations").mkdir(parents=True)
        (cls.repo / "supabase" / "migrations" / "001.sql").write_text(
            "CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n"
            "CREATE TABLE public.users (id uuid PRIMARY KEY, org_id uuid REFERENCES public.orgs(id));\n"
        )
        subprocess.run(["git", "-C", str(cls.repo), "init", "-q"], check=True)
        cls.data = base / "data"
        store.build(cls.repo, cls.data)
        cls.serve()

    def test_overview_lists_tables(self):
        value = self.get("/overview")
        self.assertEqual([t["name"] for t in value["tables"]], ["orgs", "users"])
        self.assertNotIn("facts", value["manifest"])
        self.assertNotIn("inputs", value["manifest"])

    def test_graph_and_findings(self):
        self.assertEqual(len(self.get("/graph")["edges"]), 1)
        self.assertTrue(self.get("/findings")["findings"])

    def test_rebuild_with_no_path_uses_the_known_repo(self):
        reply = json.load(self.post("/build", {}))
        self.assertTrue(reply["unchanged"])

    def test_proxied_prefix_works_too(self):
        self.assertEqual(self.get("/apps/system-map/api/overview")["tables"][0]["name"], "orgs")

    def test_node_and_neighbors(self):
        self.assertEqual(self.get("/node?id=table:public.users")["name"], "users")
        self.assertEqual(len(self.get("/neighbors?id=table:public.orgs")["incoming"]), 1)

    def test_missing_node_is_a_404(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.get("/node?id=table:public.nope")
        self.assertEqual(caught.exception.code, 404)

    def test_worktrees_lists_the_repo(self):
        found = self.get("/worktrees")
        self.assertEqual(len(found["worktrees"]), 1)
        self.assertEqual(found["overlaps"], [])
        self.assertEqual(found["counts"]["high"], 0)

    def test_coverage_with_no_report_is_a_400_saying_why(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/coverage", {})
        self.assertEqual(caught.exception.code, 400)
        self.assertIn("no coverage report", json.load(caught.exception)["error"])

    def test_risk_reads_with_or_without_a_report(self):
        value = self.get("/risk")
        self.assertIsNone(value["coverage"])
        self.assertEqual(value["window_days"], 90)
        report = Path(self._tmp.name) / "lcov.info"
        report.write_text("SF:supabase/migrations/001.sql\nDA:1,1\nDA:2,0\nend_of_record\n")
        reply = json.load(self.post("/coverage", {"report": str(report), "commit": "abc"}))
        self.assertEqual((reply["lines_hit"], reply["lines_total"]), (1, 2))
        self.assertEqual(self.get("/risk")["coverage"]["commit"], "abc")

    def test_explore_starts_empty_and_a_status_needs_a_real_proposal(self):
        self.assertEqual(sorted(self.get("/explore")), ["proposals", "use_cases", "views"])
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/proposal-status", {"id": "ghost", "status": "accepted"})
        self.assertEqual(caught.exception.code, 404)

    def test_a_missing_proposal_is_a_404(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.get("/proposal?id=ghost")
        self.assertEqual(caught.exception.code, 404)

    def test_a_delete_needs_a_real_kind(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/intent-delete", {"kind": "tables", "id": "x"})
        self.assertEqual(caught.exception.code, 400)

    def test_build_refuses_a_folder_without_migrations(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/build", {"repo_path": str(self.data)})
        self.assertEqual(caught.exception.code, 400)


class AgentRoutes(Served):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.repo = base / "repo"
        for name, text in FILES.items():
            path = cls.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        git(cls.repo, "init", "-q", "-b", "main")
        commit_all(cls.repo)
        cls.data = base / "data"
        store.build(cls.repo, cls.data)
        cls.target = store.repo_dir(cls.repo, cls.data)
        cls.serve()

    def setUp(self):
        self.post("/agents/settings", {"settings": {}})
        self.post("/regions", {"id": "service:anthropic", "region": None})
        (self.target / "intent" / "agents-draft.json").unlink(missing_ok=True)

    def draft(self):
        """What the Design chat does through `draft_agents`."""
        agent_drafts.save(self.target, SETTINGS, EVIDENCE, "Read the registry.")

    def refused(self, path, body):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post(path, body)
        return caught.exception.code, json.load(caught.exception)["error"]

    def test_with_no_settings_there_are_suggestions(self):
        value = self.get("/agents")
        self.assertEqual((value["agents"], value["settings"], value["suggestions"]), ([], {}, ["module:src/agents"]))
        self.assertEqual(value["defaults"]["jobs_key"], "handlers")

    def test_saving_settings_shows_the_agents(self):
        reply = json.load(self.post("/agents/settings", {"settings": SETTINGS}))
        self.assertEqual(reply["settings"]["list"], "src/agents/registry.ts")
        rows = {row["name"]: row for row in self.get("/agents")["agents"]}
        self.assertEqual(list(rows), ["sorter", "reader", "mail", "digest"])
        self.assertEqual({link["node"] for link in rows["sorter"]["hands_off_to"]}, {"agent:reader", "agent:mail"})
        self.assertEqual(self.get("/node?id=agent:sorter")["label"], "Sorter")

    def test_bad_settings_are_a_400_saying_why(self):
        code, error = self.refused("/agents/settings", {"settings": {"list": "src/nope.ts"}})
        self.assertEqual(code, 400)
        self.assertIn("no file", error)
        self.assertEqual(self.refused("/agents/settings", {"settings": "x"})[0], 400)

    def test_a_region_marks_agents_and_adds_findings(self):
        self.post("/agents/settings", {"settings": {**SETTINGS, "home_region": "Canada"}})
        reply = json.load(self.post("/regions", {"id": "service:anthropic", "region": "US"}))
        self.assertEqual(reply, {"id": "service:anthropic", "region": "US"})
        state = self.get("/agents")
        self.assertEqual(state["home_region"], "Canada")
        sorter = next(row for row in state["agents"] if row["name"] == "sorter")
        self.assertEqual(sorter["leaves_region"], ["service:anthropic"])
        checks = {(f["check"], f["node"]) for f in self.get("/findings")["findings"]}
        self.assertIn(("agent-leaves-region", "agent:sorter"), checks)

    def test_only_a_service_takes_a_region(self):
        self.assertEqual(self.refused("/regions", {"id": "module:src/desk", "region": "US"})[0], 404)
        self.assertEqual(self.refused("/regions", {"id": "service:anthropic", "region": ""})[0], 400)

    def test_no_draft_reads_as_none(self):
        self.assertEqual(self.get("/agents/draft"), {"draft": None, "changed": [], "stale": False})

    def test_a_draft_reads_back_with_what_it_would_change(self):
        self.draft()
        value = self.get("/agents/draft")
        self.assertEqual((value["draft"]["settings"], value["draft"]["note"], value["stale"]), (SETTINGS, "Read the registry.", False))
        self.assertEqual(value["changed"], ["list", "hand_off_keys", "model_calls", "asks_you_calls"])

    def test_using_a_draft_saves_it_and_shows_the_agents(self):
        self.draft()
        reply = json.load(self.post("/agents/draft", {"action": "use"}))
        self.assertEqual(reply["settings"], SETTINGS)
        self.assertEqual([row["name"] for row in self.get("/agents")["agents"]], ["sorter", "reader", "mail", "digest"])
        self.assertIsNone(self.get("/agents/draft")["draft"])

    def test_dropping_a_draft_keeps_the_settings(self):
        self.post("/agents/settings", {"settings": {"home_region": "Canada"}})
        self.draft()
        self.assertEqual(json.load(self.post("/agents/draft", {"action": "drop"})), {"dropped": True})
        self.assertIsNone(self.get("/agents/draft")["draft"])
        self.assertEqual(self.get("/agents")["settings"], {"home_region": "Canada"})

    def test_a_draft_action_must_be_use_or_drop_and_need_a_draft(self):
        self.assertEqual(self.refused("/agents/draft", {"action": "use"}), (404, "no agent draft"))
        self.assertEqual(self.refused("/agents/draft", {"action": "drop"}), (404, "no agent draft"))
        self.draft()
        self.assertEqual(self.refused("/agents/draft", {"action": "accept"}), (400, "action must be use or drop"))
        self.assertIsNotNone(self.get("/agents/draft")["draft"])

    def test_a_draft_the_person_did_not_see_is_refused(self):
        self.draft()
        seen = self.get("/agents/draft")["draft"]["id"]
        self.draft()
        self.assertEqual(self.refused("/agents/draft", {"action": "use", "id": seen}), (400, "The Design chat saved a new draft since. Look at it first."))
        self.assertEqual(self.refused("/agents/draft", {"action": "use", "id": 3}), (400, "id must be the draft's id"))
        newest = self.get("/agents/draft")["draft"]["id"]
        self.assertEqual(json.load(self.post("/agents/draft", {"action": "drop", "id": newest})), {"dropped": True})

    def test_no_route_touches_the_repo(self):
        self.post("/agents/settings", {"settings": {**SETTINGS, "home_region": "Canada"}})
        self.post("/regions", {"id": "service:anthropic", "region": "US"})
        self.draft()
        self.post("/agents/draft", {"action": "use"})
        self.draft()
        self.post("/agents/draft", {"action": "drop"})
        self.assertEqual(git(self.repo, "status", "--porcelain"), "")


def message(**pairs):
    """Headers as the backend gets them: names match in any case."""
    found = email.message.Message()
    for name, value in pairs.items():
        found[name.replace("_", "-")] = value
    return found


class Signature(unittest.TestCase):
    """The App Kit's signing rule, held to `server.signed` with a fixed clock."""

    NOW = 1_800_000_000
    TARGET = "/apps/system-map/api/overview?repo=a%20b"
    BODY = b'{"repo": "x"}'
    NONCE = "0123456789abcdef0123456789abcdef"

    def setUp(self):
        server._nonces.clear()

    def check(self, headers, method="POST", target=TARGET, body=BODY, secret=PROXY_SECRET, now=NOW):
        return server.signed(headers, method, target, body, secret, now)

    def v1(self, method="POST", target=TARGET, body=BODY, secret=PROXY_SECRET, stamp=NOW):
        return proxy_signature(method, target, body, secret, stamp)

    def v2(self, nonce=NONCE, stamp=NOW):
        return proxy_v2("POST", self.TARGET, self.BODY, nonce, stamp=stamp)

    def test_a_good_v1_signature_passes(self):
        self.assertTrue(self.check(message(X_KiroCrew_Proxy=self.v1())))
        self.assertTrue(self.check(message(x_kirocrew_proxy=self.v1())))

    def test_each_signed_part_is_bound(self):
        for changed in (
            {"method": "GET"},
            {"target": "/apps/system-map/api/overview"},
            {"body": b'{"repo": "y"}'},
            {"secret": "another-secret"},
        ):
            with self.subTest(changed=changed):
                self.assertFalse(self.check(message(X_KiroCrew_Proxy=self.v1(**changed))))

    def test_a_stamp_is_good_for_60_seconds_either_way(self):
        for offset, good in ((-61, False), (-60, True), (0, True), (60, True), (61, False)):
            with self.subTest(offset=offset):
                header = message(X_KiroCrew_Proxy=self.v1(stamp=self.NOW + offset))
                self.assertEqual(self.check(header), good)

    def test_a_bad_header_fails_without_raising(self):
        mac = self.v1().partition(":")[2]
        for value in ("", ":", "abc", str(self.NOW), f"{self.NOW}:", f"12x:{mac}", f"²:{mac}", f"{self.NOW}:é", f"1{self.NOW:012d}:{mac}"):
            with self.subTest(value=value):
                self.assertFalse(self.check(message(X_KiroCrew_Proxy=value)))
        self.assertFalse(self.check(message()))

    def test_no_secret_means_nothing_passes(self):
        header = message(X_KiroCrew_Proxy=self.v1(secret=""))
        self.assertFalse(self.check(header, secret=""))

    def test_a_good_v2_passes_once(self):
        header = message(X_KiroCrew_Proxy=self.v1(), X_KiroCrew_Proxy_V2=self.v2(), X_KiroCrew_Proxy_Nonce=self.NONCE)
        self.assertTrue(self.check(header))
        self.assertFalse(self.check(header))

    def test_a_bad_v2_does_not_fall_back_to_v1(self):
        good_v1 = self.v1()
        for extra in (
            {"X_KiroCrew_Proxy_V2": self.v2(nonce="f" * 32), "X_KiroCrew_Proxy_Nonce": self.NONCE},
            {"X_KiroCrew_Proxy_Nonce": self.NONCE},
            {"X_KiroCrew_Proxy_V2": self.v2()},
            {"X_KiroCrew_Proxy_V2": self.v2(nonce=self.NONCE.upper()), "X_KiroCrew_Proxy_Nonce": self.NONCE.upper()},
        ):
            with self.subTest(extra=sorted(extra)):
                self.assertFalse(self.check(message(X_KiroCrew_Proxy=good_v1, **extra)))

    def test_a_full_nonce_store_refuses_until_old_nonces_expire(self):
        def request(nonce, now):
            stamp = int(now)
            header = message(X_KiroCrew_Proxy_V2=self.v2(nonce, stamp), X_KiroCrew_Proxy_Nonce=nonce)
            return self.check(header, now=now)

        with mock.patch.object(server, "NONCE_LIMIT", 2):
            self.assertTrue(request("a" * 32, self.NOW))
            self.assertTrue(request("b" * 32, self.NOW))
            self.assertFalse(request("c" * 32, self.NOW))
            self.assertTrue(request("c" * 32, self.NOW + 61))


class Gate(Served):
    """The running backend refuses any call the gateway didn't sign."""

    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.repo = base / "repo"
        (cls.repo / "supabase" / "migrations").mkdir(parents=True)
        (cls.repo / "supabase" / "migrations" / "001.sql").write_text("CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n")
        subprocess.run(["git", "-C", str(cls.repo), "init", "-q"], check=True)
        cls.data = base / "data"
        store.build(cls.repo, cls.data)
        cls.serve()

    def test_health_needs_no_signature(self):
        self.assertEqual(self.raw("/health"), {"status": "ok"})

    def test_an_unsigned_read_is_a_401_saying_why(self):
        for path in ("/repos", "/apps/system-map/api/overview", "/nope"):
            with self.subTest(path=path):
                self.assertEqual(self.status(path), 401)
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.raw("/repos")
        self.assertIn("Kiro Crew", json.load(caught.exception)["error"])

    def test_an_unsigned_remove_is_refused_and_removes_nothing(self):
        key = self.get("/repos")["repos"][0]["repo_key"]
        self.assertEqual(self.status("/repo-remove", json.dumps({"repo": key}).encode(), method="POST"), 401)
        self.assertEqual([row["repo_key"] for row in self.get("/repos")["repos"]], [key])

    def test_a_signature_made_with_another_secret_is_a_401(self):
        header = proxy_signature("GET", "/repos", b"", secret="another-secret")
        self.assertEqual(self.status("/repos", headers={"X-KiroCrew-Proxy": header}), 401)

    def test_a_stale_signature_is_a_401(self):
        header = proxy_signature("GET", "/repos", b"", stamp=int(time.time()) - 120)
        self.assertEqual(self.status("/repos", headers={"X-KiroCrew-Proxy": header}), 401)

    def test_a_body_changed_after_signing_is_a_401(self):
        header = proxy_signature("POST", "/plan-status", b'{"id": "a"}')
        self.assertEqual(self.status("/plan-status", b'{"id": "b"}', {"X-KiroCrew-Proxy": header}, "POST"), 401)

    def test_the_query_is_signed_too(self):
        header = proxy_signature("GET", "/overview", b"")
        self.assertEqual(self.status("/overview?repo=x", headers={"X-KiroCrew-Proxy": header}), 401)

    def test_a_replayed_v2_request_is_a_401(self):
        nonce = os.urandom(16).hex()
        headers = {
            "X-KiroCrew-Proxy": proxy_signature("GET", "/repos", b""),
            "X-KiroCrew-Proxy-V2": proxy_v2("GET", "/repos", b"", nonce),
            "X-KiroCrew-Proxy-Nonce": nonce,
        }
        self.assertEqual(self.status("/repos", headers=headers), 200)
        self.assertEqual(self.status("/repos", headers=headers), 401)


class Threads(unittest.TestCase):
    """A long build holds the write turn, but reads still get answers, and other writes wait."""

    def test_reads_go_on_while_a_build_runs(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        started, release = threading.Event(), threading.Event()

        def slow_build(path, *args, **kwargs):
            started.set()
            release.wait(10)
            return {"repo_key": "k", "unchanged": True}

        env = {"KIROCREW_PROXY_SECRET": PROXY_SECRET, "KIROCREW_SPAWNED": "1", "SYSTEM_MAP_DATA": tmp.name}
        with (
            mock.patch.dict(os.environ, env),
            mock.patch.object(server.store, "build", side_effect=slow_build),
            mock.patch.object(server.store, "check_folder", side_effect=lambda path: path),
        ):
            httpd = server.Server(("127.0.0.1", 0), server.Handler)
            threading.Thread(target=httpd.serve_forever, daemon=True).start()
            self.addCleanup(httpd.server_close)
            self.addCleanup(httpd.shutdown)
            url = f"http://127.0.0.1:{httpd.server_address[1]}"

            def call(path, body, done):
                try:
                    urllib.request.urlopen(signed_request(url + path, json.dumps(body).encode()), timeout=20).read()
                except urllib.error.HTTPError:
                    pass
                done.set()

            built, wrote = threading.Event(), threading.Event()
            threading.Thread(target=call, args=("/build", {"repo_path": tmp.name}, built), daemon=True).start()
            self.assertTrue(started.wait(5))
            with urllib.request.urlopen(signed_request(url + "/repos"), timeout=2) as reply:
                self.assertEqual(json.load(reply)["repos"], [])
            threading.Thread(target=call, args=("/plan-status", {"id": "x"}, wrote), daemon=True).start()
            self.assertFalse(wrote.wait(0.5), "a second write ran while the build held the turn")
            release.set()
            self.assertTrue(built.wait(5))
            self.assertTrue(wrote.wait(5))


class Bare(Served):
    """A backend over an empty data folder, started with `gateway_env`."""

    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        cls.data = Path(cls._tmp.name) / "data"
        cls.serve()


class Bodies(Bare):
    """A bad length or a body that isn't a JSON object gets words, not a dropped connection."""

    def send(self, method, path, headers, body=b""):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        self.addCleanup(connection.close)
        connection.putrequest(method, path)
        for name, value in headers.items():
            connection.putheader(name, value)
        connection.endheaders(body)
        reply = connection.getresponse()
        return reply.status, json.loads(reply.read())

    def test_a_length_that_is_not_a_whole_number_is_a_400(self):
        for given in ("abc", "-1", "1.5", "²"):
            with self.subTest(given=given):
                code, reply = self.send("POST", "/build", {"Content-Length": given})
                self.assertEqual(code, 400)
                self.assertIn("whole number", reply["error"])

    def test_a_body_over_the_cap_is_a_413_before_it_is_read(self):
        code, reply = self.send("POST", "/build", {"Content-Length": str(server.MAX_BODY_BYTES + 1)})
        self.assertEqual(code, 413)
        self.assertIn(str(server.MAX_BODY_BYTES), reply["error"])

    def test_a_signed_body_that_is_not_an_object_is_a_400(self):
        for body, wanted in ((b"[1]", "JSON object"), (b"\xff", "bad JSON")):
            with self.subTest(body=body):
                headers = {"Content-Length": str(len(body)), "X-KiroCrew-Proxy": proxy_signature("POST", "/build", body)}
                code, reply = self.send("POST", "/build", headers, body)
                self.assertEqual(code, 400)
                self.assertIn(wanted, reply["error"])


class NoSecret(Bare):
    """A gateway with no secret for the app: fail closed, but stay healthy."""

    gateway_env = {"KIROCREW_SPAWNED": "1", "KIROCREW_APP_NAME": "system-map", "KIROCREW_SPAWN_INSTANCE": "test"}

    def test_even_a_signed_call_is_refused(self):
        self.assertEqual(self.status("/repos", headers={"X-KiroCrew-Proxy": proxy_signature("GET", "/repos", b"")}), 401)
        self.assertEqual(self.raw("/health"), {"status": "ok"})


class DevUnsigned(Bare):
    """`ui/dev` asks for unsigned calls by name."""

    gateway_env = {"SYSTEM_MAP_UNSIGNED": "1"}

    def test_an_unsigned_call_works(self):
        self.assertEqual(self.raw("/repos")["repos"], [])


class DevUnsignedFromAnAgentShell(DevUnsigned):
    """An agent's shell inherits `KIROCREW_SPAWNED`, and can still run `ui/dev`."""

    gateway_env = {"SYSTEM_MAP_UNSIGNED": "1", "KIROCREW_SPAWNED": "1"}


class DevFlagUnderTheGateway(Bare):
    """A backend the gateway starts for the app ignores the dev flag."""

    gateway_env = {**Served.gateway_env, "SYSTEM_MAP_UNSIGNED": "1"}

    def test_an_unsigned_call_is_still_refused(self):
        self.assertEqual(self.status("/repos"), 401)


class DevFlagWithOnlyTheSpawnInstance(DevFlagUnderTheGateway):
    """Either gateway variable is enough to turn the flag off."""

    gateway_env = {"SYSTEM_MAP_UNSIGNED": "1", "KIROCREW_SPAWN_INSTANCE": "test", "KIROCREW_PROXY_SECRET": PROXY_SECRET}


if __name__ == "__main__":
    unittest.main()
