import { type VariantProps } from 'class-variance-authority';
export declare const controlVariants: (props?: ({
    size?: "default" | "xs" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ControlVariantProps = VariantProps<typeof controlVariants>;
