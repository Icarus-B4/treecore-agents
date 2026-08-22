import { type ReactNode } from 'react';
interface ZoomableProps {
    /** Inline content; also the default full-view content. */
    children: ReactNode;
    /** Full-view content, if it should differ from the inline version. */
    overlay?: ReactNode;
    /** Copy/export action shown in the viewer toolbar. */
    onCopy?: () => Promise<void> | void;
    /** Accessible label for the expand affordance. */
    label?: string;
    className?: string;
}
/**
 * Generic click-to-expand viewer: renders inline content with a hover "expand"
 * affordance, then opens a full overlay where the content can be panned/zoomed
 * (see useZoomPan) and optionally copied. Content-agnostic — wrap a diagram,
 * image, or any node.
 */
export declare function Zoomable({ children, overlay, onCopy, label, className }: ZoomableProps): import("react").JSX.Element;
export {};
