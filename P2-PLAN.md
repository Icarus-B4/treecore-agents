# P2 Plan — Installer-Fork (`apps/installer`)

**Status: architecture read, NOT yet built.** This plan is honest about what the
Rust code actually does, which corrected an earlier assumption.

## What `bootstrap.rs` actually is (read, not guessed)

The installer is a **generic stage runner**, not a hardcoded installer.

- `bootstrap.rs` (1120 LOC) contains **zero stage definitions**. It resolves an
  `install.ps1` / `install.sh` script (`install_script.rs`), calls
  `install.ps1 -Manifest`, parses the returned JSON `Manifest { stages: [...] }`,
  then iterates `manifest.stages` calling `install.ps1 -Stage NAME -NonInteractive`.
- The **stage list is dynamic, produced by the script at runtime** — not a Rust
  enum, not a TOML file upstream. `events.rs` `StageInfo` is just the parsed
  shape: `{ name, title, category, needs_user_input }`.
- So `stages.toml` does **not** replace a Rust constant. It would replace the
  *install script's* job of declaring stages — a much larger surface than the
  earlier summary implied. The original summary ("data-driven `stages.toml`
  replacing `install_script.rs`") was wrong in scale: `install_script.rs` is the
  *script fetcher* (dev-checkout / bundled / cached / GitHub download at a pinned
  commit), not the stage list.

## The coupling that P0 already removed

P0's `packages/ui` broke the installer's one hard repo knot:

```css
/* upstream bootstrap-installer/src/styles.css */
@import '../../desktop/src/styles.css';   /* points into apps/desktop */
```

The code comment there even warns about it. With the design system in
`packages/ui`, the installer imports `@boilerplate/ui/styles.css` instead — no
cross-app path. That part of P2 is already done.

## Three viable shapes for P2

### A. Thin TOML manifest, script still drives (closest to upstream)
Keep `bootstrap.rs` as the runner, but let `stages.toml` *seed* the stage list
instead of (or in addition to) `install.ps1 -Manifest`. Rust reads
`stages.toml` → `Vec<StageInfo>` → same iteration loop. The script still runs
each stage's logic. Lowest risk, but the script remains the source of truth for
*what each stage does*.

### B. TOML is the installer (replace the script)
`stages.toml` declares not just names but shell/powershell steps per stage.
Rust executes them directly, `install.ps1` disappears. This is the "data-driven
installer" the earlier summary imagined — but it means **re-implementing every
stage's logic** that currently lives in `install.ps1` (repo clone, dep install,
desktop build, shortcut creation, marker write). That is the 502-LOC
`install_script.rs` plus the unknown `install.ps1` body upstream. **Not**
estimable until `install.ps1` is read too.

### C. Port the runner verbatim, swap only the stylesheet
Carry `bootstrap.rs` + `events.rs` + `install_script.rs` + `powershell.rs` into
`apps/installer/src-tauri` unchanged except the stylesheet import. The design
system decoupling is the win; the installer behaviour is bit-for-bit upstream's.
Highest fidelity, lowest design value, but it *is* a working standalone
installer.

## What I will NOT do

Guess the `install.ps1` body. The stage *logic* lives there, and `bootstrap.rs`
only references it by invocation. Any plan that claims "stages.toml replaces X"
without reading `install.ps1` first is the kind of speculation you've told me to
avoid. Before shape B, `install.ps1` / `install.sh` must be read.

## Recommended next step

**Shape C first** — it's the only path that yields a *working, verified*
standalone installer without re-implementing unknown logic, and it proves the
`packages/ui` decoupling end-to-end (installer + shell + design system in one
workspace). The Tauri scaffold already exists in upstream
(`tauri.conf.json`, `Cargo.toml`, `main.rs`); porting it is mechanical once the
design-system import is fixed. Shape A/B are follow-ups after `install.ps1` is
read.

## Verification gates for P2 (when built)

- `cargo build` (workspace includes `apps/installer`) exits 0
- installer binary launches, `start_bootstrap` emits `Manifest` → `Stage` × N →
  `Complete` against a temp `HERMES_HOME`
- E2E against a temp install root (upstream AGENTS.md explicitly wants real-path
  E2E, not mocked resolution)
- design-system `no-upstream-imports` gate still passes for `packages/ui`
