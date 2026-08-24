import argparse
import logging
import unittest

from tools import registry as tool_registry


class RuntimeLogBrandingTests(unittest.TestCase):
    def test_expected_false_tool_check_is_debug_not_warning(self):
        tool_registry.invalidate_check_fn_cache()

        def unavailable_optional_tool():
            return False

        with self.assertLogs("tools.registry", level=logging.DEBUG) as captured:
            self.assertFalse(tool_registry._check_fn_cached(unavailable_optional_tool))

        self.assertFalse(any(line.startswith("WARNING:") for line in captured.output))
        self.assertTrue(
            any(
                line.startswith("DEBUG:")
                and "dependent tools will be unavailable this turn" in line
                for line in captured.output
            )
        )

    def test_treecore_ready_banner_contains_no_hermes_branding(self):
        from treecore_cli.web_server import _treecore_ready_banner

        self.assertEqual(
            _treecore_ready_banner(True, "127.0.0.1", 9120),
            "  Treecore backend listening on 127.0.0.1:9120",
        )
        self.assertEqual(
            _treecore_ready_banner(False, "127.0.0.1", 9120),
            "  Treecore Web UI → http://127.0.0.1:9120",
        )

    def test_dashboard_and_serve_help_are_treecore_branded(self):
        from treecore_cli.subcommands.dashboard import build_dashboard_parser

        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers(dest="command")
        build_dashboard_parser(
            subparsers,
            cmd_dashboard=lambda _args: None,
            cmd_dashboard_register=lambda _args: None,
        )

        for command in ("dashboard", "serve"):
            help_text = subparsers.choices[command].format_help()
            self.assertNotIn("Hermes", help_text)
            self.assertIn("Treecore", help_text)

    def test_treecore_dashboard_uses_dedicated_default_port(self):
        from inspect import signature

        from treecore_cli.main import _parse_dashboard_runtime
        from treecore_cli.subcommands.dashboard import build_dashboard_parser
        from treecore_cli.web_server import start_server

        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers(dest="command")
        build_dashboard_parser(
            subparsers,
            cmd_dashboard=lambda _args: None,
            cmd_dashboard_register=lambda _args: None,
        )

        self.assertEqual(parser.parse_args(["dashboard"]).port, 9120)
        self.assertEqual(parser.parse_args(["serve"]).port, 9120)
        self.assertEqual(_parse_dashboard_runtime("treecore dashboard"), ("dashboard", "127.0.0.1", 9120))
        self.assertEqual(signature(start_server).parameters["port"].default, 9120)

    def test_dashboard_injects_treecore_and_upstream_auth_globals(self):
        from pathlib import Path
        from tempfile import TemporaryDirectory
        from unittest.mock import patch

        from fastapi import FastAPI
        from fastapi.testclient import TestClient

        import treecore_cli.web_server as web_server

        with TemporaryDirectory() as tmp:
            dist = Path(tmp)
            (dist / "assets").mkdir()
            (dist / "index.html").write_text(
                "<!doctype html><html><head></head><body></body></html>",
                encoding="utf-8",
            )
            application = FastAPI()
            web_server.app.state.auth_required = False
            with patch.object(web_server, "WEB_DIST", dist):
                web_server.mount_spa(application)
                html = TestClient(application).get("/").text

        for name in (
            "__TREECORE_SESSION_TOKEN__",
            "__TREECORE_DASHBOARD_EMBEDDED_CHAT__",
            "__TREECORE_BASE_PATH__",
            "__TREECORE_AUTH_REQUIRED__",
            "__HERMES_SESSION_TOKEN__",
            "__HERMES_DASHBOARD_EMBEDDED_CHAT__",
            "__HERMES_BASE_PATH__",
            "__HERMES_AUTH_REQUIRED__",
        ):
            self.assertIn(name, html)


if __name__ == "__main__":
    unittest.main()
