import { sketchManifest } from "./sketch-manifest"

type SketchModule = {
    create?: (el: HTMLDivElement, options?: string) => void | Promise<void>
}


function searchLoader(path: string): (() => Promise<unknown>) | null {
    if (path in sketchManifest) {
        return sketchManifest[path].loader;
    }
    return null;
}

async function mountSketch(el: HTMLDivElement) {
    const path = el.getAttribute("data-path");
    if (!path) return;
    const options = JSON.parse(el.getAttribute("data-options") ?? "{}");
    
    try {
        // pretty URL対策
        const loader = searchLoader(path);
        
        if (!loader) {    
            console.error(`[sketch] sketch not found, path: ${path}`);
            return
        }

        const module = await loader() as SketchModule
        if (typeof module.create !== "function") {
            console.error(`[sketch] create() is not exported: ${name}`)
            return
        }

        await module.create(el, options)
    } catch (error) {
        console.error(`[sketch] failed to load: ${name}`, error)
    }
}

export function initSketches() {
    document.querySelectorAll(".sketch").forEach(el => {
        void mountSketch(el as HTMLDivElement)
    })
}
