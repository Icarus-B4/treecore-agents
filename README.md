# Treecore Agents

Treecore Agents is a local-first Windows desktop fork of Hermes Agent with its
own product identity, runtime paths, installer, update channel, and Python
backend.

The source repository is private. Public Windows release artifacts are
published separately through
[`Icarus-B4/myGitappstore`](https://github.com/Icarus-B4/myGitappstore).

## Repository layout

| Path | Purpose |
|---|---|
| `apps/desktop-full/` | Electron + React desktop application and Windows installer |
| `treecore_cli/` | Treecore CLI, local dashboard, bootstrap, profiles, and configuration |
| `agent/`, `tools/`, `gateway/` | Agent runtime, tool registry, session routing, and messaging gateway |
| `packages/shared/` | Shared desktop/backend protocol types |
| `scripts/install.ps1` | Windows bootstrap installer used by the desktop first-run flow |

## What works today

- ✅ Treecore-branded desktop, tray, taskbar, installer, and application icons
- ✅ First-run bootstrap into Treecore-owned paths under
  `%LOCALAPPDATA%\treecore`
- ✅ Local Python backend started and monitored by the desktop
- ✅ Persistent session transcripts and metadata in SQLite (`state.db`)
- ✅ Multi-session and multi-profile session management in the desktop and
  dashboard
- ✅ Streaming chat with configurable model providers and provider fallbacks
- ✅ Full agent tool registry, including terminal execution and file
  read/write/search/patch tools
- ✅ Embedded terminal with the Treecore virtual environment first on `PATH`
- ✅ Treecore CLI commands such as `treecore doctor` and `treecore dashboard`
- ✅ Local dashboard protected by a per-process session token; optional OAuth
  gating is available for deliberately exposed/non-loopback deployments
- ✅ Direct Windows update checks and downloads from the public artifact
  repository without requiring an external terminal
- ✅ `3CORE↬AGENT` wordmark with its original typography and a single-run decode
  animation

The old claims that sessions were RAM-only, that the gateway had no
multi-session/profile support, and that only `/shell` existed are no longer
true for this repository.

## Windows paths

| Data | Path |
|---|---|
| Treecore home/config | `%LOCALAPPDATA%\treecore` |
| Managed backend checkout | `%LOCALAPPDATA%\treecore\treecore-agents` |
| Managed Python environment | `%LOCALAPPDATA%\treecore\treecore-agents\venv` |
| Desktop and backend logs | `%LOCALAPPDATA%\treecore\logs` |
| Installed application | `%LOCALAPPDATA%\Programs\Treecore` |

The embedded terminal starts PowerShell with `-NoLogo -NoProfile`. This keeps
user PowerShell profiles and old global Hermes aliases out of the Treecore
terminal. Its environment sets `TREECORE_DESKTOP_TERMINAL=1` and prepends the
managed Treecore virtual environment to `PATH`.

## Development

Requirements:

- Windows 11
- Node.js 22.22 or newer
- npm
- Python 3.11
- Git

Install dependencies at the repository root:

```bash
npm install
```

Build and start the desktop from `apps/desktop-full`:

```bash
npm run build
npm run start
```

On Windows, a launch from a shell without a real console can make `node-pty`
fail with `AttachConsole failed`. For manual runtime testing, start Electron
through a real Windows console:

```bat
cmd /c start "" node_modules/.bin/electron.cmd .
```

Useful verification commands:

```bash
npm run typecheck
npm test
npm run build
npm run builder -- --win nsis
```

The generated installer is written to:

```text
apps/desktop-full/release/Treecore-Agents-Setup-<version>-x64.exe
```

## Updates and releases

The desktop uses `electron-updater` and reads release metadata from the public
artifact repository:

```text
Icarus-B4/myGitappstore
```

The private source repository is not the client update feed. Installer names
follow this format:

```text
Treecore-Agents-Setup-<version>-<arch>.exe
```

The Windows installer identity remains:

```text
com.webstarkorg.treecore.setup
```

Do not change that identity casually; it keeps Treecore separate from the
original Hermes installation.

## Important compatibility rule

`@assistant-ui/tap` must remain pinned to `0.9.8` in both the dependency and
root override. Version `0.9.14` caused a `useSyncExternalStore` render loop and
`Maximum update depth exceeded` crashes in the chat surface. Do not upgrade it
without a dedicated loop regression test.

## Model-provider troubleshooting

API-key providers require a valid key in the user's Treecore configuration; no
developer keys are shipped in the application. A provider response such as
HTTP `401 invalid_api_key` is a rejected credential, not a terminal or gateway
failure. Reconfigure the provider with:

```text
treecore setup
```

or use the model/provider picker. Never commit provider keys or place them in a
release artifact.

## Current boundaries

- Proprietary cloud sync, hosted remote-agent management, and billing services
  are not provided by this local fork.
- A non-loopback/public dashboard deployment must be explicitly configured with
  its supported OAuth gate; the default local token model is intended for the
  desktop on the same machine.
- End-user model accounts, API keys, and infrastructure remain user-managed.

## License

See the repository license and the individual upstream package licenses.
