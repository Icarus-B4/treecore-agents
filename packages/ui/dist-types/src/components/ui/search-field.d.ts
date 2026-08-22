import { type ReactNode, type RefObject } from 'react';
interface SearchFieldProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    /**
     * Data-driven placeholder suggestions ("Try \u201ccreative\u201d") — one is picked at
     * random per mount, the nudge that search understands more than names.
     * Falls back to `placeholder` when absent/empty.
     */
    hints?: string[];
    containerClassName?: string;
    inputClassName?: string;
    loading?: boolean;
    onClear?: () => void;
    inputRef?: RefObject<HTMLInputElement | null>;
    trailingAction?: ReactNode;
    'aria-label'?: string;
}
/**
 * Shared search field used everywhere (sessions sidebar, pages, overlays,
 * command center, cron). No box — borderless until focus, then an underline.
 * Rests at low opacity until focused or filled. Width/placement come from
 * `containerClassName`.
 */
export declare function SearchField({ placeholder, value, onChange, hints, containerClassName, inputClassName, loading, onClear, inputRef, trailingAction, 'aria-label': ariaLabel }: SearchFieldProps): import("react").JSX.Element;
export {};
