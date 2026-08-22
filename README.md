# hermes-boilerplate

A standalone, lightweight template carrying the **design system** of the Hermes
Agent desktop app — its tokens, theme runtime, UI primitives and layout shell —
with none of the agent's business logic.

Verified working, not aspirational: `npm run check` and `npm run build` both pass,
and the reference app renders and re-themes in a real browser.

## Measured against the source

| | upstream `apps/desktop` | this template |
|---|---|---|
| production build | 17.07 s | **2.24 s** |
| npm packages | 1186 | **129** |
| largest JS chunk | 18.98 MB (shiki) | **246 kB** |
| CSS custom properties | 273 | **273** (zero lost) |
| TS/TSX source files | 1211 | **29** |

The CSS row is the important one: the aesthetic is fully present, the weight is not.

## Layout

```
packages/ui/                 the design system — no app dependencies
  src/styles.css             2.2k lines, 273 tokens. THE aesthetic.
  src/styles.reference.css   pristine upstream copy, for the parity gate
  src/theme/                 presets, color math, applyTheme(), provider
  src/components/ui/         primitives, copied VERBATIM from upstream
  src/lib/                   cn(), icon barrel, keybind formatting
  src/i18n/                  the ONE seam (see below)
  assets/fonts/              JetBrains Mono (Apache-2.0)

apps/shell/                  reference app proving the system stands alone
scripts/                     the two CI gates
```

## How the aesthetic actually works

Miss a link in this chain and you get an *almost* correct UI with a green build:

```
theme/presets.ts          TS palettes (hex values)
  ↓ applyTheme() writes --theme-* seeds + --dt-* palette onto :root
styles.css @theme inline  --color-background: var(--dt-background)
  ↓ --ui-* layer derives from --theme-* via color-mix()
Tailwind utilities        bg-background, text-(--ui-text-primary)
```

`styles.css` and `applyTheme()` are **one unit**. Port the stylesheet alone and
every `color-mix()` resolves against undefined properties — which CSS treats as
transparent rather than as an error. That silence is why the token gate exists.

## Two gates, and why

```bash
npm run check          # typecheck + both gates
```

**`check:tokens`** diffs custom-property *names* in `styles.css` against
`styles.reference.css`. Names are the contract; values are yours to rebrand.
A lost token degrades silently, so this is the only reliable check — looking at
the page is not one.

**`check:decoupled`** asserts `packages/ui` imports nothing from an app or
business layer (`@/store`, `@/hermes`, `@hermes/shared`, …). Upstream measured
**zero** such imports; this freezes that property, because the first "I just need
one store value in this primitive" is what ends a template's reusability.
It strips comments before scanning, so the ports can document what they removed.

## The primitives are copied verbatim — deliberately

Not one primitive was edited. Re-syncing with upstream is a file copy, never a
merge. Two pieces of plumbing buy that:

1. **`@/` resolves per importer.** Design-system files mean their own package
   root; the app means its `src`. One alias cannot serve both, so
   `apps/shell/vite.config.ts` resolves by importer — mirroring what the two
   tsconfigs already do with separate `paths`. Editing the primitives to relative
   paths would have been the easy fix and the wrong one.
2. **`packages/ui/src/i18n`** reproduces upstream's shape exactly: `useI18n()`
   returns an *object*, and `t` is a *nested dictionary* accessed as
   `t.common.close` — not a `t(key, fallback)` call. Both facts were read off the
   source; both would have been guessed wrong. The template ships only the key
   groups its primitives touch, with English defaults, so a missing key is a
   compile error rather than a blank label.

## What was intentionally dropped

| dropped | why |
|---|---|
| `Collapse-Bold.woff2` | proprietary, redistribution unclear. Verified: **zero** consumers — only its own `@font-face`. |
| `katex.min.css` | math rendering for the chat renderer; an app concern |
| `themes/backend-sync.ts`, `vscode.ts`, `user-themes.ts` | gateway push, Marketplace import, user-theme persistence |
| Electron hooks in `applyTheme()` | `setTitleBarTheme`, `setNativeTheme`, `hermes-boot-*` — all optional-chained upstream, so removal is behaviour-neutral for web. `chromeBackground()` is kept and exported for native hosts. |
| `tooltip.tsx` | pulls in the keybind registry; re-add with that subsystem if wanted |

## Getting started

```bash
npm install
npm run check      # typecheck + gates
npm run dev        # http://127.0.0.1:5180
```

## Pitfalls that will bite you

- **`postcss: { plugins: [] }`** is pinned in the Vite config on purpose. Without
  it, `postcss-load-config` walks *up* the filesystem and any stray Tailwind v3
  config above the project reprocesses this v4 stylesheet — the build dies with
  "`@layer base` is used but no matching `@tailwind base`".
- **`@source` must list both roots.** Tailwind detects content relative to the
  stylesheet owning `@import 'tailwindcss'`, which lives in `packages/ui`. Without
  the explicit `@source ../src`, the app's own utilities are silently absent.
- **Import `styles.css` by relative path.** Tailwind's `@import` loader ignores
  Vite JS aliases; `@boilerplate/ui/styles.css` prefix-matches the package alias
  and resolves *inside* `index.ts`.
- **`composite` needs `noEmit: false`.** The base config sets `noEmit`, which wins
  and emits no declarations, leaving the project reference nothing to check.
- **Resolve to files, not directories.** `existsSync` says yes to a folder named
  `i18n`; hand that to the bundler and it fails with EACCES. Check `isFile()`.

## Adding the installer (not yet done)

`apps/bootstrap-installer` upstream is a Tauri app whose Rust stage-runner is
~4400 LOC across 8 modules, and whose stylesheet reaches into the desktop app via
`@import '../../desktop/src/styles.css'` — a hard repo coupling its own code
comment warns about. This template's `packages/ui` already removes that coupling.
The remaining work is a data-driven `stages.toml` replacing the hardcoded
`install_script.rs`. Deliberately left out of this phase: `bootstrap.rs` has not
been read closely enough to fork it honestly.
