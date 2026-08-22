import { type VariantProps } from 'class-variance-authority';
import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';
declare const switchVariants: (props?: ({
    size?: "default" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Switch({ className, size, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>): React.JSX.Element;
export { Switch };
