export declare function createRendererLoopPauseController(onChange: () => void, { pauseWhenUnfocused }?: {
    pauseWhenUnfocused?: boolean | undefined;
}): {
    dispose: () => void;
    isPaused: () => boolean;
};
