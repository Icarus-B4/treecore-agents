import { type RefObject } from 'react';
export declare function useResizeObserver(onResize: (entries: readonly ResizeObserverEntry[]) => void, ...refs: readonly RefObject<Element | null>[]): void;
