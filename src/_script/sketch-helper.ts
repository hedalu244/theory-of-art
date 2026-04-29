import type p5_ from "p5";

export type Sketch = {
    el: HTMLDivElement,
    start: () => void,
    stop: () => void,
    destroy: () => void,
}

declare const p5: typeof p5_;

export function normalizeSketch(el: HTMLDivElement, rawControl?: unknown): Sketch {
    if (!rawControl || typeof rawControl !== "object")
        rawControl = {};

    const candidate = rawControl as Sketch;

    return {
        el,
        start: typeof candidate.start === "function" ? candidate.start : () => { },
        stop: typeof candidate.stop === "function" ? candidate.stop : () => { },
        destroy: typeof candidate.destroy === "function" ? candidate.destroy : () => { },
    };
}

export function createP5Sketch(el: HTMLDivElement, sketch: (p: p5_) => void): Sketch {
    const instance = new p5(sketch, el);
    let running = true;

    return {
        el,
        start: () => {
            instance.loop();
            running = true;
        },
        stop: () => {
            instance.noLoop();
            running = false;
        },
        destroy: () => {
            instance.remove();
            running = false;
        }
    };
}

export function userToggleWrapper(sketch: Sketch): Sketch {
    // TODO: 実装
    let isPaused = false;

    return sketch;
}