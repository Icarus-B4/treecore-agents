interface ColorSwatchesProps {
    swatches: readonly string[];
    value: null | string;
    onChange: (color: null | string) => void;
    clearLabel: string;
    clearIcon?: string;
    swatchLabel?: (color: string) => string;
}
export declare function ColorSwatches({ swatches, value, onChange, clearLabel, clearIcon, swatchLabel }: ColorSwatchesProps): import("react").JSX.Element;
export {};
