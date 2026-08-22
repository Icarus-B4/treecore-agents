declare function Skeleton({ className, ...props }: React.ComponentProps<'div'>): import("react").JSX.Element;
/** Inline pulsing chip standing in for a small count/badge while it loads. */
declare function CountSkeleton({ className, ...props }: React.ComponentProps<'span'>): import("react").JSX.Element;
export { CountSkeleton, Skeleton };
