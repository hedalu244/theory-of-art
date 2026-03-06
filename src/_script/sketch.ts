import { create as testSketch } from "./sketches/test-sketch"

export function initSketches() {
    const sketches: Record<string, (el: HTMLDivElement) => void> = {
        "test-sketch": testSketch
    }

    document.querySelectorAll(".sketch").forEach(el => {
        const name = el.getAttribute("data-name");
        if (!name) return;
        const sketch = sketches[name];
        if (!sketch) return;
        sketch(el as HTMLDivElement);
    });
}