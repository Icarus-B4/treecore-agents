import { type BrailleSpinnerName as SpinnerName } from 'unicode-animations';
export type { SpinnerName };
interface GlyphSpinnerProps {
    ariaLabel?: string;
    className?: string;
    spinner?: SpinnerName;
}
/**
 * One-char glyph spinner driven by `unicode-animations` (braille, orbit, scan,
 * etc. — pick any `spinner` name). Mirrors the spinner used by the Ink TUI so
 * the desktop and terminal experiences read the same visually. Renders inside
 * an `inline-flex` cell with `leading-none` and `items-center` so it sits
 * vertically centred inside its parent's line-box.
 */
export declare function GlyphSpinner({ ariaLabel, className, spinner }: GlyphSpinnerProps): import("react").JSX.Element;
