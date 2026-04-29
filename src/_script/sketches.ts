import { sketchManifest } from "./sketch-manifest";
import { Sketch, normalizeSketch } from "./sketch-helper";

type SketchModule = {
    create: (el: HTMLDivElement, options?: unknown) => Sketch | undefined
}

type SketchState = {
    sketch: Sketch,
    path: string,
    options: unknown,
    visible: boolean,
}

const sketchStates = new WeakMap<HTMLDivElement, SketchState>();

function searchLoader(path: string): (() => Promise<unknown>) | null {
    if (path in sketchManifest) {
        return sketchManifest[path].loader;
    }
    return null;
}

function parseSketchOptions(el: HTMLDivElement): unknown {
    const rawOptions = el.getAttribute("data-options");
    try {
        return JSON.parse(rawOptions ?? "{}");
    } catch (error) {
        console.error("[sketch] failed to parse data-options", error, "raw:", rawOptions);
        return {};
    }
}

function applyVisibilityPolicy(state: SketchState): void {
    if (!state.visible || document.hidden) {
        state.sketch.stop();
        return;
    }

    state.sketch.start();
}

async function mountSketch(el: HTMLDivElement): Promise<SketchState | null> {
    const path = el.getAttribute("data-path");
    if (!path) return null;

    const options = parseSketchOptions(el);

    try {
        const loader = searchLoader(path);
        if (!loader) {
            console.error(`[sketch] sketch not found, path: ${path}`);
            return null;
        }

        const module = await loader() as SketchModule;
        if (typeof module.create !== "function") {
            console.error(`[sketch] create() is not exported: ${path}`);
            return null;
        }

        const rawSketch = await module.create(el, options) || {}; 
        const sketch = normalizeSketch(el, rawSketch); // 念のため、もしundefinedを返されても不足分を定義する
        const state: SketchState = {
            sketch: sketch,
            path,
            options,
            visible: false,
        };
        applyVisibilityPolicy(state);
        
        return state;
    } catch (error) {
        console.error(`[sketch] failed to load: ${path}`, error);
        return null;
    }
}

function handleIntersection(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
        const target = entry.target as HTMLDivElement;
        const state = sketchStates.get(target);
        if (!state) continue;

        state.visible = entry.isIntersecting;
        applyVisibilityPolicy(state);
    }
}

function setupVisibilityChangeHandler(states: SketchState[]): void {
    document.addEventListener("visibilitychange", () => {
        for (const state of states) {
            applyVisibilityPolicy(state);
        }
    });
}

function observeSketches(states: SketchState[]): void {
    if (states.length === 0) return;

    if (!("IntersectionObserver" in window)) {
        states.forEach(state => {
            state.visible = true;
            applyVisibilityPolicy(state);
        });
        return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.01,
    });

    for (const state of states) {
        sketchStates.set(state.sketch.el, state);
        observer.observe(state.sketch.el);
    }
}

export function initSketches() {
    const elements = Array.from(document.querySelectorAll(".sketch"));

    void (async () => {
        const mounted = await Promise.all(elements.map(node => {
            const el = node as HTMLDivElement;
            return mountSketch(el);
        }));

        const states = mounted.filter((state): state is SketchState => state !== null);
        setupVisibilityChangeHandler(states);
        observeSketches(states);
    })();
}
