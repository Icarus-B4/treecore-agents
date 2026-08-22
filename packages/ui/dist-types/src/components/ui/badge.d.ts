import { type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "muted" | "warn" | "outline" | null | undefined;
    size?: "default" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface BadgeProps extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
}
export declare function Badge({ asChild, className, size, variant, ...props }: BadgeProps): React.JSX.Element;
export { badgeVariants };
