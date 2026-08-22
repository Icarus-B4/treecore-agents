/**
 * Haptics seam.
 *
 * `copy-button.tsx` calls `triggerHaptic('success')` on a successful copy.
 * Upstream routes that through a nanostores-backed preference store plus a
 * native trigger registered by the Electron host — application wiring, not
 * design-system material.
 *
 * Upstream already exposes exactly the seam needed (`registerHapticTrigger`), so
 * this is that pattern with the store dependency removed: no trigger registered
 * means the calls are silent no-ops, which is the correct default for a web app.
 * A host with real haptics registers one and the primitives light up unchanged.
 *
 * The `HapticIntent` union is kept verbatim so vendored call sites type-check.
 */

export type HapticIntent =
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | 'impact-light'
  | 'impact-medium'
  | 'impact-heavy'

export interface HapticInput {
  intent?: HapticIntent
}

export type HapticTrigger = (input?: HapticInput) => Promise<void> | undefined | void

let trigger: HapticTrigger | null = null

/** Install (or clear, with null) the native haptic trigger. */
export function registerHapticTrigger(next: HapticTrigger | null): void {
  trigger = next
}

/**
 * Fire a haptic pulse. A no-op when no host trigger is registered — never
 * throws, so primitives can call it unconditionally.
 */
export function triggerHaptic(intent: HapticIntent = 'selection'): void {
  if (!trigger) {
    return
  }

  try {
    void trigger({ intent })
  } catch {
    // A failing host bridge must never break the interaction that caused it.
  }
}
