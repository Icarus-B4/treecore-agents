#!/usr/bin/env python3
"""One-shot rebrand of the copied Hermes Python backend to Treecore.

Run ONCE after copying the backend from treecore-agent-main into this repo root.
Only touches the backend paths copied in (root .py modules, agent/, tools/,
treecore_cli/, gateway/, tui_gateway/, cron/, acp_adapter/, plugins/, providers/,
treecore_cli/). Does NOT touch apps/ (already branded).
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Backend paths to operate within
BACKEND_PATHS = [
    os.path.join(ROOT, "agent"),
    os.path.join(ROOT, "tools"),
    os.path.join(ROOT, "treecore_cli"),
    os.path.join(ROOT, "gateway"),
    os.path.join(ROOT, "tui_gateway"),
    os.path.join(ROOT, "cron"),
    os.path.join(ROOT, "acp_adapter"),
    os.path.join(ROOT, "plugins"),
    os.path.join(ROOT, "providers"),
    os.path.join(ROOT, "treecore_cli"),
    os.path.join(ROOT, "pyproject.toml"),
    os.path.join(ROOT, "uv.lock"),
    os.path.join(ROOT, "setup.py"),
    os.path.join(ROOT, ".python-version"),
]
# root-level .py modules (individual files)
ROOT_MODULES = [
    "batch_runner.py", "cli.py", "treecore_cli_bootstrap.py", "treecore_constants.py",
    "treecore_cli_logging.py", "treecore_cli_state.py", "treecore_cli_state_common.py",
    "treecore_cli_state_portability.py", "treecore_cli_state_schema.py",
    "treecore_cli_state_search.py", "treecore_cli_time.py", "mcp_serve.py",
    "mini_swe_runner.py", "model_tools.py", "run_agent.py", "setup.py",
    "toolset_distributions.py", "toolsets.py", "trajectory_compressor.py",
    "utils.py",
]

# Identifier replacements: (old, new) applied to file CONTENTS.
# Order matters: longer / more specific first.
IDENT_REPLACEMENTS = [
    # package / import names
    ("treecore_cli", "treecore_cli"),
    ("treecore_constants", "treecore_constants"),
    ("treecore_cli_state_portability", "treecore_state_portability"),
    ("treecore_cli_state_schema", "treecore_state_schema"),
    ("treecore_cli_state_search", "treecore_state_search"),
    ("treecore_cli_state_common", "treecore_state_common"),
    ("treecore_cli_state", "treecore_state"),
    ("treecore_cli_logging", "treecore_logging"),
    ("treecore_cli_bootstrap", "treecore_bootstrap"),
    ("treecore_cli_time", "treecore_time"),
    ("treecore_cli_agent", "treecore_agents"),
    ("treecore_cli-acp", "treecore-acp"),
    ("treecore_cli_agent ", "treecore_agents "),
    ("'treecore_cli'", "'treecore'"),
    ('"treecore_cli"', '"treecore"'),
    ("treecore_cli", "treecore"),
    # env vars (uppercase) - applied after lowercase pass would catch them,
    # but be explicit so ordering is safe
    ("HERMES_DESKTOP_APP_NAME", "TREECORE_DESKTOP_APP_NAME"),
    ("TREECORE_HOME", "TREECORE_HOME"),
    ("HERMES_", "TREECORE_"),
]

# File-name renames
FILE_RENAMES = {
    "treecore_cli_bootstrap.py": "treecore_bootstrap.py",
    "treecore_constants.py": "treecore_constants.py",
    "treecore_cli_logging.py": "treecore_logging.py",
    "treecore_cli_state.py": "treecore_state.py",
    "treecore_cli_state_common.py": "treecore_state_common.py",
    "treecore_cli_state_portability.py": "treecore_state_portability.py",
    "treecore_cli_state_schema.py": "treecore_state_schema.py",
    "treecore_cli_state_search.py": "treecore_state_search.py",
    "treecore_cli_time.py": "treecore_time.py",
}


def collect_files():
    files = []
    for p in BACKEND_PATHS:
        if os.path.isdir(p):
            for dirpath, _dirs, fnames in os.walk(p):
                for fn in fnames:
                    if fn.endswith((".py", ".toml", ".lock", ".yaml", ".yml",
                                     ".json", ".txt", ".md", ".cfg", ".ini",
                                     ".example", ".env")):
                        files.append(os.path.join(dirpath, fn))
        elif os.path.isfile(p):
            files.append(p)
    for m in ROOT_MODULES:
        fp = os.path.join(ROOT, m)
        if os.path.isfile(fp):
            files.append(fp)
    return sorted(set(files))


def rebrand_contents(text):
    for old, new in IDENT_REPLACEMENTS:
        if old in text:
            text = text.replace(old, new)
    return text


def main():
    files = collect_files()
    print(f"Rebranding {len(files)} backend files...")
    for fp in files:
        try:
            with open(fp, "r", encoding="utf-8", errors="replace") as fh:
                original = fh.read()
        except Exception as e:
            print(f"  SKIP (read) {fp}: {e}")
            continue
        updated = rebrand_contents(original)
        if updated != original:
            with open(fp, "w", encoding="utf-8") as fh:
                fh.write(updated)
            print(f"  edited {os.path.relpath(fp, ROOT)}")
    # rename root modules
    for old, new in FILE_RENAMES.items():
        src = os.path.join(ROOT, old)
        dst = os.path.join(ROOT, new)
        if os.path.isfile(src):
            os.rename(src, dst)
            print(f"  renamed {old} -> {new}")
    # rename treecore_cli/ package dir -> treecore/
    treecore_cli_dir = os.path.join(ROOT, "treecore_cli")
    treecore_dir = os.path.join(ROOT, "treecore")
    if os.path.isdir(treecore_cli_dir) and not os.path.isdir(treecore_dir):
        os.rename(treecore_cli_dir, treecore_dir)
        print("  renamed treecore_cli/ -> treecore/")
    print("REBRAND DONE")


if __name__ == "__main__":
    main()
