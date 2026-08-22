import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
declare const kbdVariants: (props?: ({
    variant?: "default" | "ghost" | "capturing" | "inverted" | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface KbdProps extends React.ComponentProps<'kbd'>, VariantProps<typeof kbdVariants> {
}
declare function Kbd({ children, className, size, variant, ...props }: KbdProps): React.JSX.Element;
interface KbdGroupProps extends Omit<React.ComponentProps<'span'>, 'children'>, VariantProps<typeof kbdVariants> {
    keys: string[];
}
declare function KbdGroup({ className, keys, size, variant, ...props }: KbdGroupProps): React.JSX.Element;
interface KbdComboProps extends Omit<KbdGroupProps, 'keys'> {
    combo: string;
}
declare function KbdCombo({ combo, ...props }: KbdComboProps): React.JSX.Element;
export { Kbd, KbdCombo, KbdGroup, kbdVariants };
