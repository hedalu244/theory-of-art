import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Line, Box, Sphere, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts"
import { vector3, add, scale, sub } from "../../_script/linearalgebra.ts";
import { InputTable, createElement } from "../../_script/input.ts";

export function create(el: HTMLDivElement): Sketch {
    const inputTable = new InputTable(el);
    const xSlider = inputTable.createRangeInput({
        label: "左右",
        min: -100,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        hideFeedback: true,
    });

    const ySlider = inputTable.createRangeInput({
        label: "上下",
        min: -100,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        hideFeedback: true,
    });

    const zSlider = inputTable.createRangeInput({
        label: "前後",
        min: -100,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        hideFeedback: true,
    });

    const span = createElement("span");
    el.appendChild(span);

    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        }

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150);

            // outercamera
            p.camera(-300, 300, -300, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
        };

        let lastResult: null | boolean = null;
        p.draw = () => {
            p.background(255);

            p.orbitControl();

            const x = xSlider.valueAsNumber / 100;
            const y = ySlider.valueAsNumber / 100;
            const z = zSlider.valueAsNumber / 100;
            const point = [x * 120, y * 120, z * 120] as vector3;

            const newResult = camera.solve(point);
            if (lastResult != !!newResult) {
                lastResult = !!newResult;
                if (newResult) {
                    span.textContent = "点の像は存在します";
                } else {
                    span.textContent = "点の像は存在しません";
                }
            }

            if (newResult) Label.render(p, newResult, "像", "#000");
            camera.renderTrace(p, point);
            camera.outerRender(p, { target: false, axis: false, axislabel: false, critical: true });
        };
    });
}
