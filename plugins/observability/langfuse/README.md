# Langfuse Observability Plugin

This plugin ships bundled with Hermes but is **opt-in** — it only loads when
you explicitly enable it.

## Enable

Pick one:

```bash
# Interactive: walks you through credentials + SDK install + enable
treecore tools  # → Langfuse Observability

# Manual
pip install langfuse
treecore plugins enable observability/langfuse
```

## Required credentials

Set these in `~/.treecore/.env` (or via `treecore tools`):

```bash
TREECORE_LANGFUSE_PUBLIC_KEY=pk-lf-...
TREECORE_LANGFUSE_SECRET_KEY=sk-lf-...
TREECORE_LANGFUSE_BASE_URL=https://cloud.langfuse.com   # or your self-hosted URL
```

Without the SDK or credentials the hooks no-op silently — the plugin fails
open.

## Verify

```bash
treecore plugins list                 # observability/langfuse should show "enabled"
treecore chat -q "hello"              # then check Langfuse for a "Hermes turn" trace
```

## Optional tuning

```bash
TREECORE_LANGFUSE_ENV=production       # environment tag
TREECORE_LANGFUSE_RELEASE=v1.0.0       # release tag
TREECORE_LANGFUSE_SAMPLE_RATE=0.5      # sample 50% of traces
TREECORE_LANGFUSE_MAX_CHARS=12000      # max chars per field (default: 12000)
TREECORE_LANGFUSE_DEBUG=true           # verbose plugin logging
```

## Disable

```bash
treecore plugins disable observability/langfuse
```
