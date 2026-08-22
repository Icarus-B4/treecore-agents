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
/** actionId -> combo string, e.g. { 'composer.send': 'mod+enter' }. */
export type KeybindMap = Record<string, string>;
/** Merge bindings into the registry and repaint any mounted hints. */
export declare function registerKeybinds(next: KeybindMap): void;
/** Drop all registered bindings (useful in tests). */
export declare function clearKeybinds(): void;
/** Current registry snapshot. */
export declare function getKeybinds(): KeybindMap;
/**
 * The formatted combo for `actionId`, or null when unbound.
 * Signature-identical to upstream so `tooltip.tsx` needs no edit.
 */
export declare function useKeybindHint(actionId: string): string | null;
