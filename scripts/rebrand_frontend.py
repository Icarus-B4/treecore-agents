#!/usr/bin/env python3
"""Comprehensive, targeted rebrand of remaining Hermes references -> Treecore.

Complements scripts/rebrand_backend.py (Python backend package contents only).
Makes the WHOLE repo self-consistent so the desktop + installer actually run
against the renamed backend (treecore_cli) and renamed data paths.

Reference classes fixed (verified against real backend state):
  1. Backend spawn/import module name  treecore_cli            -> treecore_cli
  2. Env var                          TREECORE_HOME           -> TREECORE_HOME
  3. Data dir  %LOCALAPPDATA%\\treecore_cli / ~/.treecore / .treecore-update-in-progress
                                          -> treecore / .treecore / .treecore-update-in-progress
  4. Install root subdir              treecore-agent          -> treecore-agent
  5. Install URLs  treecore-agents.raw/install/... -> fork raw scripts URL
  6. Repo remotes  NousResearch/treecore-agent -> Icarus-B4/treecore-agents
  7. npm package   @treecore/shared -> @treecore/shared (+ lockfile)
  8. Plugin SDK alias  @treecore/plugin-sdk -> @treecore/plugin-sdk
  9. Tauri command get_treecore_home -> get_treecore_home
 10. Windows installer binary treecore-setup -> treecore-setup
 11. Manifest identity IcarusB4.Treecore.Setup -> IcarusB4.Treecore.Setup
 12. Frontend TS fields/vars  treecoreRoot/treecore_home/treecoreHome/treecoreBoot*
     -> treecoreRoot/treecore_home/treecoreHome/treecoreBoot* (NOT the
     `treecore_cliDesktop` window IPC object — see DELIBERATELY KEPT below)
 13. Standalone gateway package name + @treecore/shared ref (apps/gateway/)
 14. Rust local identifiers (treecore_cli.exe, resolve_treecore_cli, venv_treecore_cli, the
     `treecore` CLI-variable): treecore_cli -> treecore_cli in non-TS files only.
 15. Stale comment references to treecore_constants.py / treecore serve etc.

DELIBERATELY KEPT AS-IS:
  * `treecore_cliDesktop` window IPC object (TS) is an external contract between
    Electron main <-> renderer. Renaming it silently breaks every call site and
    has no functional benefit. We therefore NEVER blanket-replace inside .ts/.tsx
    files; only the explicit field/var tokens above are renamed.
  * Already-correct strings: treecore-agent, NousResearch/treecore-agent,
    treecore-agent.nousresearch.com, etc. (only exact old tokens replaced).

Idempotent. Run from repo root:  python scripts/rebrand_frontend.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXCLUDE_DIRS = {
    "node_modules", ".git", "dist", "release", "win-unpacked",
    "win-unpacked.bak", "out", "target", ".next", "build", ".treecore",
}

# (old, new) exact-token replacements applied to ALL processed files.
# Order: most specific first; the bare `treecore` blanket is applied SEPARATELY
# (see below) and only to non-TS files.
REPLACEMENTS = [
    ("treecore_cli", "treecore_cli"),
    ("@treecore/plugin-sdk", "@treecore/plugin-sdk"),
    ("https://raw.githubusercontent.com/Icarus-B4/treecore-agents/main/scripts/install.ps1",
     "https://raw.githubusercontent.com/Icarus-B4/treecore-agents/main/scripts/install.ps1"),
    ("https://raw.githubusercontent.com/Icarus-B4/treecore-agents/main/scripts/install.sh",
     "https://raw.githubusercontent.com/Icarus-B4/treecore-agents/main/scripts/install.sh"),
    ("treecore-agents.raw/install", "treecore-agents.raw/install"),  # safety net
    ("git@github.com:Icarus-B4/treecore-agents.git",
     "git@github.com:Icarus-B4/treecore-agents.git"),
    ("https://github.com/Icarus-B4/treecore-agents.git",
     "https://github.com/Icarus-B4/treecore-agents.git"),
    ("github.com/Icarus-B4/treecore-agents", "github.com/Icarus-B4/treecore-agents"),
    ("@treecore/shared", "@treecore/shared"),
    (".treecore-update-in-progress", ".treecore-update-in-progress"),
    ("treecore-agent", "treecore-agent"),
    (".treecore", ".treecore"),
    ("treecoreHome", "treecoreHome"),
    ("treecoreRoot", "treecoreRoot"),
    ("treecoreDesktopBoot", "treecoreDesktopBoot"),
    ("treecoreBoot", "treecoreBoot"),
    ("treecore_home", "treecore_home"),
    ("TREECORE_HOME", "TREECORE_HOME"),
    ("treecore-setup", "treecore-setup"),
    ("get_treecore_home", "get_treecore_home"),
    ("IcarusB4.Treecore.Setup", "IcarusB4.Treecore.Setup"),
    ("treecore-local-gateway", "treecore-local-gateway"),
    ("treecore-fade-in", "treecore-fade-in"),
    ("treecore-boot-background", "treecore-boot-background"),
    ("treecore-boot-color-scheme", "treecore-boot-color-scheme"),
    ("treecore:emojibase-assets", "treecore:emojibase-assets"),
    ("treecore-runtime-import-probe", "treecore-runtime-import-probe"),
    ("treecore-probes-ghost", "treecore-probes-ghost"),
    ("treecoreRuntimeImportProbe", "treecoreRuntimeImportProbe"),
    ("treecoreManagedNodePathEntries", "treecoreManagedNodePathEntries"),
    ("normalizeTreecoreHomeRoot", "normalizeTreecoreHomeRoot"),
    ("treecore_constants.py", "treecore_constants.py"),
    ("treecore_constants", "treecore_constants"),
    ("treecore serve", "treecore serve"),
    ("`treecore`", "`treecore`"),
]

# Applied ONLY to non-TypeScript files (Rust/PS/Bash/Python/HTML/CSS/markdown).
# Renames the remaining bare `treecore` identifier (CLI var, treecore_cli.exe,
# resolve_treecore_cli, venv_treecore_cli) to the new CLI binary name. Never touches TS so
# the `treecore_cliDesktop` IPC object is preserved.
BLANKET_NON_TS = [("treecore_cli", "treecore_cli")]

TEXT_EXTS = (
    ".py", ".rs", ".ts", ".tsx", ".js", ".jsx", ".json", ".toml", ".lock",
    ".yaml", ".yml", ".md", ".ps1", ".sh", ".mjs", ".css", ".html", ".svg",
    ".txt", ".cfg", ".ini", ".example", ".env", ".graphql", ".manifest",
)

TS_EXTS = {".ts", ".tsx", ".d.ts"}

FILE_RENAMES = {
    "use-treecore_cli-config.ts": "use-treecore-config.ts",
    "use-treecore_cli-config.test.ts": "use-treecore-config.test.ts",
    "treecore_cli-cron-scope.test.ts": "treecore-cron-scope.test.ts",
    "treecore_cli-parity.test.ts": "treecore-parity.test.ts",
    "treecore_cli-profile-scope.test.ts": "treecore-profile-scope.test.ts",
}


def should_process(relpath):
    rel = relpath.replace("\\", "/")
    if rel == "package-lock.json":
        return True
    allowed = ("scripts/", "apps/installer/", "apps/desktop-full/",
               "apps/gateway/", "packages/")
    if not any(rel.startswith(p) for p in allowed):
        return False
    return True


def collect_files():
    out = []
    for dp, dirs, fnames in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for fn in fnames:
            fp = os.path.join(dp, fn)
            rel = os.path.relpath(fp, ROOT)
            if not should_process(rel):
                continue
            if fn.lower().endswith(TEXT_EXTS):
                out.append(fp)
    return sorted(set(out))


def rebrand_text(text, is_ts):
    for old, new in REPLACEMENTS:
        if old in text:
            text = text.replace(old, new)
    if not is_ts:
        for old, new in BLANKET_NON_TS:
            if old in text:
                text = text.replace(old, new)
    return text


def main():
    files = collect_files()
    print(f"Rebranding {len(files)} files...")
    edited = 0
    for fp in files:
        is_ts = fp.lower().endswith(tuple(TS_EXTS))
        try:
            with open(fp, "r", encoding="utf-8", errors="replace") as fh:
                original = fh.read()
        except Exception as e:
            print(f"  SKIP (read) {os.path.relpath(fp, ROOT)}: {e}")
            continue
        updated = rebrand_text(original, is_ts)
        if updated != original:
            with open(fp, "w", encoding="utf-8") as fh:
                fh.write(updated)
            print(f"  edited {os.path.relpath(fp, ROOT)}")
            edited += 1
    for old, new in FILE_RENAMES.items():
        src = os.path.join(ROOT, old)
        dst = os.path.join(ROOT, new)
        if os.path.isfile(src) and not os.path.isfile(dst):
            os.rename(src, dst)
            print(f"  renamed {old} -> {new}")
    print(f"REBRAND FRONTEND DONE (edited {edited} files)")


if __name__ == "__main__":
    main()
