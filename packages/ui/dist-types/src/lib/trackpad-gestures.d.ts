export interface WheelLike {
    ctrlKey: boolean;
    deltaX: number;
    deltaY: number;
}
/** macOS "smart zoom" (two-finger double-tap): a ctrl-wheel with no delta. */
export declare function isSmartZoomWheel(e: WheelLike): boolean;
/** Pinch-to-zoom (or ctrl + mouse wheel): a ctrl-wheel carrying a delta. */
export declare function isPinchZoomWheel(e: WheelLike): boolean;
export declare const DOUBLE_TAP_MS = 300;
/**
 * Stateful double-tap detector for surfaces where a real `dblclick` may never
 * fire (e.g. a trackpad with tap-to-click off). Call it once per discrete tap;
 * it returns true when two taps land within `thresholdMs` of each other, then
 * resets so a third tap starts a fresh pair.
 */
export declare function createDoubleTapDetector(thresholdMs?: number): (now?: number) => boolean;
