import type * as React from 'react';
import { Button } from '@/components/ui/button';
interface GenerateButtonProps extends Omit<React.ComponentProps<typeof Button>, 'children' | 'onClick'> {
    /** True while a generation is in flight. */
    generating: boolean;
    /** Start a generation. */
    onGenerate: () => void;
    /** Cancel an in-flight generation. When omitted, the button just spins while
     *  generating (for one-shots that can't be cancelled). */
    onCancel?: () => void;
    /** Tooltip + aria label at rest (and while generating if no `generatingLabel`). */
    label: string;
    /** Tooltip while generating (e.g. "Stop" with cancel, "Generating…" without). */
    generatingLabel?: string;
    iconSize?: number | string;
}
/** The sparkle "generate with AI" affordance — icon + tooltip, shared by the
 *  commit-message box and the new-project idea field so they stay one pattern.
 *  Sparkle → click generates; with `onCancel`, a Stop square appears mid-run;
 *  without it, the sparkle spins until the one-shot resolves. */
export declare function GenerateButton({ generating, onGenerate, onCancel, label, generatingLabel, disabled, iconSize, className, ...rest }: GenerateButtonProps): React.JSX.Element;
export {};
