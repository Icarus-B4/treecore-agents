import type * as React from 'react';
export interface ToolIconProps {
    className?: string;
    name: string;
    size?: number | string;
}
/** Filled tool glyph. Falls back to the outline codicon font for any name not
 *  covered by the solid set so new tools still render an icon. */
export declare function ToolIcon({ className, name, size }: ToolIconProps): React.JSX.Element;
