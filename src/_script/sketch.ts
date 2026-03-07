import { create as testSketch } from "./sketches/test-sketch"
import { create as sineWave } from "./sketches/sine-wave"

export function initSketches() {
    const sketches: Record<string, (el: HTMLDivElement) => void> = {
        "test-sketch": testSketch,
        "sine-wave": sineWave,
    }

    document.querySelectorAll(".sketch").forEach(el => {
        const name = el.getAttribute("data-name");
        if (!name) return;
        const sketch = sketches[name];
        if (!sketch) return;
        sketch(el as HTMLDivElement);
    });
}