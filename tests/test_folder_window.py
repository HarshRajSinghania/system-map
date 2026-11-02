import base64
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import folder_window as window  # noqa: E402


def script(code: str) -> list[str]:
    """A stand-in for the folder window. The real one was run by hand, since it needs a person."""
    return [sys.executable, "-c", code]


class Base(unittest.TestCase):
    def setUp(self):
        window._process, window._state = None, {"status": "idle"}
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.folder = Path(self._tmp.name).resolve()
        self.addCleanup(window.close)

    def run_with(self, argv, read=window._plain_read):
        with mock.patch.object(window, "_command", return_value=window.Command(argv, read)):
            return window.open_window(str(self.folder))

    def settled(self) -> dict:
        deadline = time.time() + 5
        while time.time() < deadline:
            state = window.read()
            if state["status"] != "open":
                return state
            time.sleep(0.01)
        self.fail("the window never settled")


class Lifecycle(Base):
    def test_a_picked_folder_comes_back(self):
        self.assertEqual(self.run_with(script(f"print({str(self.folder)!r})"))["status"], "open")
        self.assertEqual(self.settled(), {"status": "picked", "path": str(self.folder)})

    def test_cancel_comes_back(self):
        self.run_with(script("raise SystemExit(1)"))
        self.assertEqual(self.settled()["status"], "cancelled")

    def test_a_crash_says_the_window_failed(self):
        self.run_with(script("raise SystemExit(7)"))
        state = self.settled()
        self.assertEqual(state["status"], "failed")
        self.assertIn("didn't open", state["message"])

    def test_a_folder_that_isnt_there_fails_in_words(self):
        self.run_with(script("print('/no/such/place')"))
        state = self.settled()
        self.assertEqual(state["status"], "failed")
        self.assertIn("can't be reached", state["message"])

    def test_a_second_ask_joins_the_open_window(self):
        with mock.patch.object(window, "_command", return_value=window.Command(script("import time; time.sleep(30)"), window._plain_read)):
            window.open_window(str(self.folder))
            first = window._process
            self.assertEqual(window.open_window(str(self.folder))["status"], "open")
            self.assertIs(window._process, first)

    def test_a_new_ask_after_a_result_starts_fresh(self):
        self.run_with(script("raise SystemExit(1)"))
        self.settled()
        self.run_with(script(f"print({str(self.folder)!r})"))
        self.assertEqual(self.settled()["status"], "picked")

    def test_close_ends_an_open_window(self):
        self.run_with(script("import time; time.sleep(30)"))
        process = window._process
        self.assertEqual(window.close()["status"], "cancelled")
        self.assertIsNotNone(process.wait(timeout=5))
        self.assertEqual(window.read()["status"], "cancelled")

    def test_a_closed_window_cant_report_later(self):
        self.run_with(script(f"import time; time.sleep(.2); print({str(self.folder)!r})"))
        window.close()
        time.sleep(0.4)
        self.assertEqual(window.read()["status"], "cancelled")

    def test_close_with_nothing_open_changes_nothing(self):
        self.assertEqual(window.close()["status"], "idle")

    def test_a_window_nobody_answers_is_ended(self):
        with mock.patch.object(window, "TIMEOUT_SECONDS", 0.1):
            self.run_with(script("import time; time.sleep(30)"))
            self.assertEqual(self.settled()["status"], "cancelled")

    def test_no_desktop_means_use_the_page(self):
        with mock.patch.object(window, "_command", return_value=None):
            self.assertEqual(window.open_window(str(self.folder))["status"], "unavailable")

    def test_a_tool_that_wont_start_means_use_the_page(self):
        self.assertEqual(self.run_with(["/no/such/tool"])["status"], "unavailable")

    def test_a_bad_start_folder_falls_back_to_home(self):
        for start in ("/no/such/place", "~nobody-here/x", None, ""):
            self.assertEqual(window._start_folder(start), str(Path.home()))


class Readers(unittest.TestCase):
    def test_plain_tools(self):
        self.assertEqual(window._plain_read(0, "/a/b\n", ""), "/a/b")
        self.assertIsNone(window._plain_read(1, "", ""))
        with self.assertRaises(RuntimeError):
            window._plain_read(5, "", "")

    def test_mac(self):
        self.assertEqual(window._mac_read(0, "/a/b/\n", ""), "/a/b/")
        self.assertIsNone(window._mac_read(1, "", "execution error: User canceled. (-128)"))
        with self.assertRaises(RuntimeError):
            window._mac_read(1, "", "execution error: other")

    def test_windows(self):
        with mock.patch.object(window, "_wsl_path", return_value="/home/me/code") as convert:
            self.assertEqual(window._windows_read(0, "noise\nPICKED:C:\\code\n", ""), "/home/me/code")
        convert.assert_called_once_with("C:\\code", "-u")
        self.assertIsNone(window._windows_read(0, "", ""))
        with self.assertRaises(RuntimeError):
            window._windows_read(1, "", "")


class Commands(unittest.TestCase):
    ODD = "/home/me/it's $(whoami) & 'co'"

    def decoded(self, argv: list[str]) -> str:
        return base64.b64decode(argv[-1]).decode("utf-16-le")

    def test_windows_gets_a_path_only_as_data(self):
        with (
            mock.patch.object(window.shutil, "which", return_value="powershell.exe"),
            mock.patch.object(window, "_wsl_path", side_effect=lambda text, _flag: text),
        ):
            command = window._windows_command(self.ODD)
        script_text = self.decoded(command.argv)
        self.assertNotIn(self.ODD, script_text)
        self.assertNotIn("whoami", script_text)
        self.assertIn(window._encoded(self.ODD), script_text)
        self.assertNotIn("__START__", script_text)

    def test_windows_opens_without_a_start_folder_if_it_cant_convert_one(self):
        with (
            mock.patch.object(window.shutil, "which", return_value="powershell.exe"),
            mock.patch.object(window, "_wsl_path", side_effect=window.Unreachable("no")),
        ):
            command = window._windows_command("/somewhere")
        self.assertIn("FromBase64String('')", self.decoded(command.argv))

    def test_wsl_without_powershell_has_no_window(self):
        with mock.patch.object(window.shutil, "which", return_value=None), mock.patch.object(window.os.path, "exists", return_value=False):
            self.assertIsNone(window._windows_command("/somewhere"))

    def test_mac_gets_a_path_only_as_an_argument(self):
        argv = window._mac_command(self.ODD).argv
        self.assertEqual(argv[-1], self.ODD)
        self.assertFalse(any(self.ODD in part for part in argv[:-1]))

    def test_linux_needs_a_screen(self):
        with mock.patch.dict(os.environ, {"DISPLAY": "", "WAYLAND_DISPLAY": ""}):
            self.assertIsNone(window._linux_command("/somewhere"))

    def test_linux_uses_what_it_finds(self):
        with mock.patch.dict(os.environ, {"DISPLAY": ":0"}):
            with mock.patch.object(window.shutil, "which", side_effect=lambda tool: tool if tool == "zenity" else None):
                self.assertEqual(window._linux_command("/a").argv[0], "zenity")
            with mock.patch.object(window.shutil, "which", side_effect=lambda tool: tool if tool == "kdialog" else None):
                self.assertEqual(window._linux_command("/a").argv[0], "kdialog")
            with mock.patch.object(window.shutil, "which", return_value=None):
                self.assertIsNone(window._linux_command("/a"))

    def test_the_switch_turns_the_window_off(self):
        with mock.patch.dict(os.environ, {"SYSTEM_MAP_NO_WINDOW": "1"}):
            self.assertIsNone(window._command("/a"))

    def test_each_system_gets_its_own_window(self):
        env = {key: value for key, value in os.environ.items() if key != "SYSTEM_MAP_NO_WINDOW"}
        with mock.patch.dict(os.environ, env, clear=True):
            with mock.patch.object(window.sys, "platform", "darwin"):
                self.assertEqual(window._command("/a").argv[0], "osascript")
            with mock.patch.object(window.sys, "platform", "linux"), mock.patch.object(window, "is_wsl", return_value=True):
                with mock.patch.object(window, "_windows_command", return_value="windows"):
                    self.assertEqual(window._command("/a"), "windows")
            with mock.patch.object(window.sys, "platform", "linux"), mock.patch.object(window, "is_wsl", return_value=False):
                with mock.patch.object(window, "_linux_command", return_value="linux"):
                    self.assertEqual(window._command("/a"), "linux")
