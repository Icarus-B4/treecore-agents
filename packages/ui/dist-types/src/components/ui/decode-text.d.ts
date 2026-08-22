import { type ComponentProps } from 'react';
/**
 * DecodeText — the "CONNECTING" scramble-decode effect as a reusable
 * primitive (extracted from gateway-connecting-overlay.tsx; same mechanics):
 *
 *  - Even-weight mono ascii charset so cycling glyphs never jump width
 *    (matches the nousnet-web download-button decode effect).
 *  - Decode resolves half a character per 45ms tick; when fully resolved it
 *    holds for 16 ticks, then (in loop mode) replays.
 *  - The first `prefix` characters NEVER scramble — split at render level so
 *    no timer logic (even a stale HMR one) can garble them.
 *  - Optional blinking dither-cursor square.
 *
 * Typography (mono, small, uppercase, wide tracking) is baked in; color comes
 * from the caller via className/text color so the same primitive works on the
 * boot overlay (--theme-primary) and quiet surfaces (--ui-text-quaternary).
 */
export declare const DECODE_SCRAMBLE_CHARS = "/\\|-_=+<>~:*";
export interface DecodeTextProps extends Omit<ComponentProps<'span'>, 'prefix'> {
    text: string;
    /** Leading character count that stays legible at all times. */
    prefix?: number;
    /** Run the decode. When false, renders the plain resolved text (used to
     *  freeze the word during exit choreography). */
    active?: boolean;
    /** Replay after the hold, or resolve once and stop. */
    loop?: boolean;
    /** Blinking dither-cursor square after the text. */
    cursor?: boolean;
}
export declare function DecodeText({ active, className, cursor, loop, prefix, text, ...props }: DecodeTextProps): import("react").JSX.Element;
