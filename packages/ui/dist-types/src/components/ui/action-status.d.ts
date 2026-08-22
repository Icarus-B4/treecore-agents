import type { ReactNode } from 'react';
export declare function ActionStatus({ state, idle, busy, done, idleIcon }: {
    state: 'done' | 'idle' | 'saving';
    idle: string;
    busy: string;
    done: string;
    idleIcon?: ReactNode;
}): import("react").JSX.Element;
