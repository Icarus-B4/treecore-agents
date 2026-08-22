import type { IconComponent } from '@/lib/icons';
export interface SegmentedControlOption<T extends string> {
    id: T;
    label: string;
    icon?: IconComponent;
}
interface SegmentedControlProps<T extends string> {
    options: readonly SegmentedControlOption<T>[];
    value: T;
    onChange: (id: T) => void;
    className?: string;
    /** Dims the whole track and blocks selection (e.g. gated behind a prerequisite). */
    disabled?: boolean;
}
/**
 * Grouped one-row toggle used for small mutually-exclusive choices
 * (color mode, tool-call display, usage period, etc.). Flat by design —
 * no per-option borders, just a tinted track with a raised active pill.
 */
export declare function SegmentedControl<T extends string>({ className, disabled, onChange, options, value }: SegmentedControlProps<T>): import("react").JSX.Element;
export {};
