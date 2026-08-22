import * as React from 'react';
/**
 * A full-row / region click target rendered as a real `<button>`: bakes in
 * `type="button"` + a stable `data-slot`, imposes no styling (callers keep their
 * own layout classes, so nothing changes visually). Use for row/region targets;
 * use `Button` for ordinary compact actions.
 */
declare function RowButton({ className, type, ...props }: React.ComponentProps<'button'>): React.JSX.Element;
export { RowButton };
