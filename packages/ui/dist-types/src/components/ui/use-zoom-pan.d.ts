import { type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react';
/**
 * Headless pan/zoom transform. Wheel zooms toward the cursor, drag pans, buttons
 * zoom toward centre. Returns the transform style plus the surface handlers, so
 * any content (SVG, image, canvas) can be made pan/zoomable.
 */
export declare function useZoomPan(): {
    panning: boolean;
    reset: () => void;
    scale: number;
    stageProps: {
        onPointerDown: (event: ReactPointerEvent) => void;
        onPointerLeave: () => void;
        onPointerMove: (event: ReactPointerEvent) => void;
        onPointerUp: () => void;
        onWheel: (event: ReactWheelEvent) => void;
    };
    style: CSSProperties;
    zoomIn: () => void;
    zoomOut: () => void;
};
