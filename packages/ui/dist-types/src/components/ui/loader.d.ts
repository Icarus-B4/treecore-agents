import { type ComponentProps } from 'react';
export declare const LOADER_TYPES: readonly ["original-thinking", "thinking-five", "thinking-nine", "rose-orbit", "rose-curve", "rose-two", "rose-three", "rose-four", "lissajous-drift", "lemniscate-bloom", "hypotrochoid-loop", "three-petal-spiral", "four-petal-spiral", "five-petal-spiral", "six-petal-spiral", "butterfly-phase", "cardioid-glow", "cardioid-heart", "heart-wave", "spiral-search", "fourier-flow"];
export type LoaderType = (typeof LOADER_TYPES)[number];
interface LoaderProps extends Omit<ComponentProps<'div'>, 'children'> {
    label?: string;
    pathSteps?: number;
    strokeScale?: number;
    type?: LoaderType;
}
export declare function Loader({ className, label, pathSteps, role, strokeScale, type, ...props }: LoaderProps): import("react").JSX.Element;
export {};
