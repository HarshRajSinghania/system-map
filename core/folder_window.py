"""Open the computer's own folder window, so picking a folder feels like anywhere else.

A web page can't do this: its folder picker gives a name, never a path. So the backend opens
the window, on the machine it runs on. The page starts it and then polls, because a person can
take minutes, and the server answers one request at a time.

Every path reaches the window as data, never as script text, so a folder name can't run.
"""
from __future__ import annotations

import base64
import os
import platform
import shutil
import subprocess
import sys
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

TITLE = "Select default folder"
#: A window nobody answers shouldn't hold its process forever.
TIMEOUT_SECONDS = 900
POWERSHELL = "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"
#: Windows' own folder window, the one Explorer uses. The older tree window can't reach WSL.
WINDOWS_SCRIPT = r"""
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class FolderWindow {
  const uint PickFolders = 0x20, ForceFileSystem = 0x40, FileSystemPath = 0x80058000;
  const int Cancelled = unchecked((int)0x800704C7);

  [ComImport, Guid("DC1C5A9C-E88A-4dde-A5A1-60F82A20AEF7")] class FileOpenDialog {}

  [ComImport, Guid("43826d1e-e718-42ee-bc55-a1e261c37bfe"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IShellItem {
    void BindToHandler(); void GetParent();
    void GetDisplayName(uint form, [MarshalAs(UnmanagedType.LPWStr)] out string name);
    void GetAttributes(); void Compare();
  }

  [ComImport, Guid("42f85136-db7e-439c-85f1-e4075d135fc8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IFileDialog {
    [PreserveSig] int Show(IntPtr owner);
    void SetFileTypes(); void SetFileTypeIndex(); void GetFileTypeIndex();
    void Advise(); void Unadvise();
    void SetOptions(uint options);
    void GetOptions(out uint options);
    void SetDefaultFolder(IShellItem item);
    void SetFolder(IShellItem item);
    void GetFolder(); void GetCurrentSelection();
    void SetFileName(); void GetFileName();
    void SetTitle([MarshalAs(UnmanagedType.LPWStr)] string title);
    void SetOkButtonLabel(); void SetFileNameLabel();
    void GetResult(out IShellItem item);
  }

  [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
  static extern void SHCreateItemFromParsingName(
    string path, IntPtr context, [MarshalAs(UnmanagedType.LPStruct)] Guid kind,
    [MarshalAs(UnmanagedType.Interface)] out IShellItem item);

  public static string Pick(IntPtr owner, string start, string title) {
    var window = (IFileDialog)new FileOpenDialog();
    uint options;
    window.GetOptions(out options);
    window.SetOptions(options | PickFolders | ForceFileSystem);
    window.SetTitle(title);
    if (start != "") {
      IShellItem folder;
      SHCreateItemFromParsingName(start, IntPtr.Zero, typeof(IShellItem).GUID, out folder);
      window.SetFolder(folder);
    }
    int result = window.Show(owner);
    if (result == Cancelled) return "";
    Marshal.ThrowExceptionForHR(result);
    IShellItem picked;
    window.GetResult(out picked);
    string path;
    picked.GetDisplayName(FileSystemPath, out path);
    return path;
  }
}
'@
$start = [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('__START__'))
$title = [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('__TITLE__'))
# A window opened from the background lands behind the browser, unless a topmost one owns it.
$owner = New-Object System.Windows.Forms.Form
$owner.TopMost = $true
$owner.ShowInTaskbar = $false
$owner.Opacity = 0
$owner.StartPosition = 'CenterScreen'
$owner.Size = New-Object System.Drawing.Size(1, 1)
$owner.Show()
$picked = [FolderWindow]::Pick($owner.Handle, $start, $title)
$owner.Close()
if ($picked) { Write-Output "PICKED:$picked" }
"""


class Unreachable(Exception):
    """The person picked something this machine can't open, with words saying so."""


@dataclass
class Command:
    argv: list[str]
    #: Takes the exit code, stdout and stderr. Answers a path, or None when the person cancelled.
    read: Callable[[int, str, str], str | None]


def _plain_read(code: int, out: str, _err: str) -> str | None:
    if code == 1:
        return None
    if code != 0 or not out.strip():
        raise RuntimeError(f"folder window exited {code}")
    return out.strip()


def _mac_read(code: int, out: str, err: str) -> str | None:
    if code != 0 and "-128" in err:
        return None
    if code != 0 or not out.strip():
        raise RuntimeError(f"folder window exited {code}")
    return out.strip()


def _wsl_path(text: str, flag: str) -> str:
    done = subprocess.run(["wslpath", flag, text], capture_output=True, text=True, timeout=5)
    if done.returncode != 0 or not done.stdout.strip():
        raise Unreachable("That folder can't be reached from where System Map runs.")
    return done.stdout.strip()


def _windows_read(code: int, out: str, _err: str) -> str | None:
    if code != 0:
        raise RuntimeError(f"folder window exited {code}")
    for line in out.splitlines():
        if line.startswith("PICKED:"):
            return _wsl_path(line.removeprefix("PICKED:").strip(), "-u")
    return None


def _encoded(text: str) -> str:
    return base64.b64encode(text.encode("utf-16-le")).decode()


def is_wsl() -> bool:
    return "microsoft" in platform.uname().release.lower()


def _windows_command(start: str) -> Command | None:
    shell = shutil.which("powershell.exe") or (POWERSHELL if os.path.exists(POWERSHELL) else None)
    if shell is None:
        return None
    try:
        windows_start = _wsl_path(start, "-w")
    except (Unreachable, OSError, subprocess.SubprocessError):
        windows_start = ""
    script = WINDOWS_SCRIPT.replace("__START__", _encoded(windows_start)).replace("__TITLE__", _encoded(TITLE))
    argv = [shell, "-NoProfile", "-NonInteractive", "-STA", "-ExecutionPolicy", "Bypass", "-EncodedCommand", _encoded(script)]
    return Command(argv, _windows_read)


def _mac_command(start: str) -> Command:
    prompt = f'POSIX path of (choose folder with prompt "{TITLE}" default location (POSIX file (item 1 of argv)))'
    return Command(["osascript", "-e", "on run argv", "-e", "activate", "-e", prompt, "-e", "end run", start], _mac_read)


def _linux_command(start: str) -> Command | None:
    if not (os.environ.get("DISPLAY") or os.environ.get("WAYLAND_DISPLAY")):
        return None
    zenity = shutil.which("zenity")
    if zenity:
        return Command([zenity, "--file-selection", "--directory", f"--title={TITLE}", f"--filename={start}/"], _plain_read)
    kdialog = shutil.which("kdialog")
    if kdialog:
        return Command([kdialog, "--title", TITLE, "--getexistingdirectory", start], _plain_read)
    return None


def _command(start: str) -> Command | None:
    """How to open a folder window here, or None where there's no desktop to open it on."""
    if os.environ.get("SYSTEM_MAP_NO_WINDOW"):
        return None
    if sys.platform == "darwin":
        return _mac_command(start)
    return _windows_command(start) if is_wsl() else _linux_command(start)


_lock = threading.Lock()
_state: dict = {"status": "idle"}
_process: subprocess.Popen | None = None


def _finish(process: subprocess.Popen, result: dict) -> None:
    global _process, _state
    with _lock:
        if _process is process:  # A close can have settled this already.
            _process, _state = None, result


def _wait(process: subprocess.Popen, read: Callable[[int, str, str], str | None]) -> None:
    try:
        out, err = process.communicate(timeout=TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        process.kill()
        process.communicate()
        _finish(process, {"status": "cancelled"})
        return
    try:
        picked = read(process.returncode, out, err)
    except Unreachable as error:
        _finish(process, {"status": "failed", "message": str(error)})
        return
    except (RuntimeError, OSError, subprocess.SubprocessError):
        _finish(process, {"status": "failed", "message": "The folder window didn't open."})
        return
    if picked is None:
        _finish(process, {"status": "cancelled"})
    elif Path(picked).is_dir():
        _finish(process, {"status": "picked", "path": str(Path(picked))})
    else:
        _finish(process, {"status": "failed", "message": "That folder can't be reached from where System Map runs."})


def _start_folder(start: str | None) -> str:
    try:
        folder = Path(start).expanduser() if start else Path.home()
        return str(folder if folder.is_dir() else Path.home())
    except (OSError, RuntimeError):
        return str(Path.home())


def open_window(start: str | None) -> dict:
    """Open the window, or join the one already open. `unavailable` means use the page's list."""
    global _process, _state
    begin = _start_folder(start)
    with _lock:
        if _process is not None:
            return dict(_state)
        command = _command(begin)
        if command is None:
            _state = {"status": "unavailable"}
            return dict(_state)
        try:
            _process = subprocess.Popen(
                command.argv, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8", errors="replace"
            )
        except OSError:
            _state = {"status": "unavailable"}
            return dict(_state)
        _state = {"status": "open"}
        threading.Thread(target=_wait, args=(_process, command.read), daemon=True).start()
        return dict(_state)


def read() -> dict:
    with _lock:
        return dict(_state)


def close() -> dict:
    """Close an open window, as when the page that asked for it goes away."""
    global _process, _state
    with _lock:
        process, _process = _process, None
        if process is None:
            return dict(_state)
        _state = {"status": "cancelled"}
        process.terminate()
        return dict(_state)
