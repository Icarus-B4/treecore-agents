import { type ComponentProps } from 'react';
export interface StatusPulseProps extends Omit<ComponentProps<'span'>, 'children' | 'ref'> {
    kind: 'opacity' | 'ping';
    opacity?: number;
}
/**
 * A finite status pulse with a real sleep between plays.
 *
 * Continuous CSS animations keep Chromium producing frames and recalculating
 * styles for an otherwise motionless Desktop window. Drive the same visual
 * cue directly so React stays out of the loop and the renderer/compositor can
 * sleep between pulses.
 */
export declare function StatusPulse({ kind, opacity, ...props }: StatusPulseProps): import("react").JSX.Element;
