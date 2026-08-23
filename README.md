# treecore Boilerplate (Local Edition)

A **standalone, Nous-free copy** of the treecore Desktop app. Same UI, same
features, same layout — but it connects to a **local gateway** you run
yourself instead of the Nous cloud backend.

> ⚠️ This is NOT a replacement for treecore. It is a template: the full desktop
> client (copied 1:1) plus a minimal local gateway that speaks the same
> JSON-RPC protocol. The gateway is a starting point, not a complete backend.

---

## What's in here

| Path | What |
|---|---|
| `apps/desktop-full/` | The complete treecore Desktop app, copied 1:1 from `treecore-agents-main/apps/desktop`. Renders the real UI. |
| `apps/gateway/` | Minimal local backend: JSON-RPC over WebSocket + REST. Bridges to any OpenAI-compatible LLM. |
| `packages/ui/` | Extracted design-system (tokens + 73 primitives). |
| `packages/shared/` | `@hermes/shared` protocol types (copied, no Nous dependency). |

---

## Quick start

### 1. Start the local gateway

```bash
cd apps/gateway
npm install
LLM_MOCK=1 node src/index.mjs
# → listening on http://localhost:8789 (ws /api/ws)
```

The gateway URL is `http://localhost:8789`.

**LLM modes:**
- `LLM_MOCK=1` — replies with a stub, no real model needed (good for testing the UI).
- Real LLM — point it at any OpenAI-compatible endpoint:
  ```bash
  LLM_BASE_URL=http://localhost:11434/v1 \   # e.g. local Ollama
  LLM_API_KEY=sk-... \                        # or leave empty for Ollama
  LLM_MODEL=llama3.1 \
  node src/index.mjs
  ```

### 2. Start the desktop app

> ⚠️ **Close the original treecore.exe first.** The app uses a single-instance
> lock — if the original treecore is running, your copy will not open a window.

```bash
cd apps/desktop-full
npm install
npm run start
```

On first run, the setup flow asks for a gateway URL. Enter:

```
http://localhost:8789
```

That's it. The app connects to your local gateway and chat works.

---

## What works today

- ✅ Full treecore Desktop UI (all 6 regions: title bar, sidebar, center, right pane, terminal, status bar)
- ✅ Connects to local gateway over JSON-RPC (WebSocket)
- ✅ Chat with streaming responses (mock or real LLM)
- ✅ `/shell <cmd>` command runs a local shell command
- ✅ Session list + sidebar (in-memory)
- ✅ **Accent Picker plugin** — live OKLCH color picker in the status bar that
  re-tints the whole app (Settings ▸ Plugins ▸ "Accent Picker", dev authoring
  tool, not persisted across reloads)
- ✅ **Render loop fixed** — the chat surface no longer crashes with
  "Maximum update depth exceeded" (was caused by a `@assistant-ui/tap@0.9.14`
  pin; reverted to `0.9.8` to match upstream)

## Known fixes & notes

- **`@assistant-ui/tap` must stay at `0.9.8`.** The fork previously pinned
  `0.9.14` (explicit dep + root `overrides`), but that version has a
  `useSyncExternalStore` loop bug that crashes the chat surface on every
  render ("Maximum update depth exceeded"). Upstream `hermes-agent` ships
  `0.9.8`; keep it there. Do **not** bump it without verifying the loop stays
  gone.
- **Accent Picker** is a bundled plugin (`apps/desktop-full/src/plugins/accent/`)
  ported from `hermes-agent` issue #91107. It wires `$accentOverride`
  (`themes/accent-override.ts`) through `retintTheme` (`themes/retint.ts`) in
  `themes/context.tsx` so the picker live-retints the app. Ships **off**
  (`defaultEnabled: false`) — enable it in Settings ▸ Plugins.

## What's NOT done (gateway is a starting point)

- ❌ **No persistence** — sessions live in RAM, gone on restart
- ❌ **No multi-session management** in the gateway
- ❌ **Only `/shell` tool** — no file read/write UI, no code-execution pane
- ❌ **No auth / profiles** — gateway is open, local only
- ❌ **No Nous features** — no cloud sync, no remote agents, no billing

To make this a real local backend, extend `apps/gateway/src/index.mjs`:
add more RPC methods (see `dispatch()`), persist sessions to disk, add tools.

---

## Architecture

```
┌─────────────────────┐         JSON-RPC 2.0 over WS          ┌─────────────────────┐
│  treecore Desktop     │  ───────────────────────────────────▶ │  Local Gateway      │
│  (apps/desktop-full)│  ◀─────────────────────────────────── │  (apps/gateway)     │
│                     │   events: gateway.ready,              │                     │
│  renderer + electron│   message.start/delta/complete,       │  → bridges to LLM   │
└─────────────────────┘   session.info, tool.*               │  → runs /shell      │
                                                                  └─────────────────────┘
```

The client speaks the `@hermes/shared` JSON-RPC protocol. The gateway
implements the subset the client needs. Add methods as required.

---

## Original source

Copied from `treecore-agents-main` (apps/desktop, packages/shared) — stripped of
all Nous-specific backend connections. The gateway URL is user-configured,
not hardcoded.

## License

See individual package licenses from the upstream source.
