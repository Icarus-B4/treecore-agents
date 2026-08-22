import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
declare const buttonVariants: (props?: ({
    variant?: "link" | "text" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "textStrong" | null | undefined;
    size?: "default" | "inline" | "icon" | "xs" | "sm" | "lg" | "micro" | "icon-xs" | "icon-sm" | "icon-lg" | "icon-titlebar" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): React.JSX.Element;
export { Button, buttonVariants };
