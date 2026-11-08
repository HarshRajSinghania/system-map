"""The strict runner fails a suite that skipped anything, and says which test and why."""
import io
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from tests import strict  # noqa: E402


def small_suite(with_skip: bool) -> unittest.TestSuite:
    """Built here, not at module level, so the real discovery never meets the skip."""

    class Inner(unittest.TestCase):
        def test_passes(self):
            pass

        @unittest.skip("needs a tool nobody installed")
        def test_skipped(self):
            pass

    names = ["test_passes", "test_skipped"] if with_skip else ["test_passes"]
    return unittest.TestSuite(Inner(name) for name in names)


class Strict(unittest.TestCase):
    def test_a_skip_gives_exit_code_1_and_is_named_with_its_reason(self):
        out = io.StringIO()
        self.assertEqual(strict.run(small_suite(with_skip=True), out), 1)
        self.assertRegex(out.getvalue(), r"SKIPPED \S*Inner\.test_skipped: needs a tool nobody installed")

    def test_a_suite_with_no_skips_gives_exit_code_0(self):
        out = io.StringIO()
        self.assertEqual(strict.run(small_suite(with_skip=False), out), 0)
        self.assertNotIn("SKIPPED", out.getvalue())


if __name__ == "__main__":
    unittest.main()
