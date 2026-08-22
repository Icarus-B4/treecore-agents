import * as React from 'react';
declare const TRACK_HEIGHT: {
    readonly sm: "h-1";
    readonly default: "h-1.5";
    readonly lg: "h-2";
};
export interface ProgressProps extends Omit<React.ComponentProps<'div'>, 'children'> {
    /** Completion as a 0–1 fraction; clamped. Ignored when `indeterminate`. */
    value?: number;
    /** No known endpoint — animate instead of showing a fixed width. */
    indeterminate?: boolean;
    /**
     * Use the continuous sliding animation for the indeterminate state (the pet
     * hatch look) instead of the default pulse. No effect when determinate.
     */
    animated?: boolean;
    /** Swap the fill to the destructive color for error / over-limit states. */
    destructive?: boolean;
    size?: keyof typeof TRACK_HEIGHT;
    /** Override the fill color/shape (e.g. billing's tone mapping, pet's accent). */
    fillClassName?: string;
    fillStyle?: React.CSSProperties;
    /** Extra content inside the track, behind the fill (e.g. a threshold marker). */
    children?: React.ReactNode;
}
/**
 * The app's one progress/meter bar: a rounded track with an animated fill. The
 * track owns `role="progressbar"` and its aria values; the fill is width-driven
 * (determinate) or animated (indeterminate). Consumers needing a bespoke look —
 * billing's hatched empty state, tone-mapped or accent fills — override
 * `className` (track) and `fillClassName` while inheriting the structure,
 * sizing, and accessibility.
 */
export declare function Progress({ value, indeterminate, animated, destructive, size, className, fillClassName, fillStyle, children, ...props }: ProgressProps): React.JSX.Element;
export {};
