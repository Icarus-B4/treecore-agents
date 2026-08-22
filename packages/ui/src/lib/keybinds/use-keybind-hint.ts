/**
 * Keybind hint bridge.
 *
 * Upstream resolves a tooltip's shortcut hint through the agent's own machinery:
 * a nanostores binding store, a plugin registry version signal, and a readonly
 * action table. That is application wiring, not design-system material — but
 * `tooltip.tsx` calls `useKeybindHint(actionId)` and the primitives are kept
 * verbatim, so the seam has to exist with the same signature.
 *
 * Instead of a dead stub that always returns null (which would quietly delete a
 * real feature from the template), this is a small registry an app can fill:
 *
 *   import { registerKeybinds } from '@boilerplate/ui'
 *   registerKeybinds({ 'composer.send': 'mod+enter' })
 *
 * Unregistered ids return null — exactly upstream's behaviour for unknown
 * actions, where the tooltip shows its text label with no trailing hint.
 *
 * Combos are formatted with the vendored `formatCombo`, so a registered binding
 * renders with the same platform-aware glyphs (⌘/⌥/⇧) as upstream.
 */

import { useCallback, useEffect, useState } from 'react'

import { formatCombo } from './combo'

/** actionId -> combo string, e.g. { 'composer.send': 'mod+enter' }. */
export type KeybindMap = Record<string, string>

let bindings: KeybindMap = {}

// Plain subscriber set: the design system must not pull in a state library just
// to publish one value.
const listeners = new Set<() => void>()

const emit = (): void => {
  for (const listener of listeners) {
    listener()
  }
}

/** Merge bindings into the registry and repaint any mounted hints. */
export function registerKeybinds(next: KeybindMap): void {
  bindings = { ...bindings, ...next }
  emit()
}

/** Drop all registered bindings (useful in tests). */
export function clearKeybinds(): void {
  bindings = {}
  emit()
}

/** Current registry snapshot. */
export function getKeybinds(): KeybindMap {
  return bindings
}

/**
 * The formatted combo for `actionId`, or null when unbound.
 * Signature-identical to upstream so `tooltip.tsx` needs no edit.
 */
export function useKeybindHint(actionId: string): string | null {
  const [, forceRepaint] = useState(0)

  useEffect(() => {
    const listener = () => forceRepaint(v => v + 1)

    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }, [])

  const resolve = useCallback(() => {
    const combo = bindings[actionId]

    return combo ? formatCombo(combo) : null
  }, [actionId])

  return resolve()
}
