"""Run the whole suite like `python3 -m unittest discover -s tests`, but fail on any skip.

A skipped test means a tool was missing, so the check it stands for did not run. Run from the repo root:

    python3 tests/strict.py
"""

import sys
import unittest
from pathlib import Path


def run(suite: unittest.TestSuite, stream=None) -> int:
    """Run `suite`; 0 only if at least one test ran, every one passed and none was skipped.
    Each skipped test is printed with its reason."""
    stream = stream or sys.stderr
    result = unittest.TextTestRunner(stream=stream, verbosity=1).run(suite)
    for test, reason in result.skipped:
        print(f"SKIPPED {test.id()}: {reason}", file=stream)
    if result.skipped:
        print(f"FAILED: {len(result.skipped)} test(s) skipped; strict mode needs 0", file=stream)
    if result.testsRun == 0:
        print("FAILED: 0 tests ran, so nothing was checked", file=stream)
        return 1
    return 0 if result.wasSuccessful() and not result.skipped else 1


def main() -> int:
    # The tests folder beside this file, whatever folder this is run from.
    here = str(Path(__file__).resolve().parent)
    return run(unittest.defaultTestLoader.discover(here, top_level_dir=here))


if __name__ == "__main__":
    sys.exit(main())
