interface DiffCountProps {
    added: number;
    removed: number;
    className?: string;
}
/** Animated `+A −B` line-count, green/red via the top-level theme vars. Each
 *  number springs up/down via Motion (0 → value on first mount). */
export declare function DiffCount({ added, removed, className }: DiffCountProps): import("react").JSX.Element | null;
export {};
