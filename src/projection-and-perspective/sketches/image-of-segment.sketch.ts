import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Segment, Box, Sphere, Point, Shape } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";
import { vector3, add, scale, sub } from "../../_script/linearalgebra.ts";
import { InputTable, createElement } from "../../_script/input.ts";

export function create(el: HTMLDivElement, options: {
    virtual?: boolean;
}): Sketch {
    const span = createElement("span");
    el.appendChild(span);

    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;
        let line: Segment;

        p.preload = () => {
            Label.loadFont(p);
        };

        const A = [-60, -60, 150] as vector3;
        const B = [60, 60, 300] as vector3;

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150);
            line = new Segment(A, B, "#000");
            // outercamera
            p.camera(-300, 300, -200, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            const x = Math.abs(p.millis() / 3000 % 2 - 1);
            const point = add(scale(A, 1 - x), scale(B, x)) as vector3;
            const image = camera.solve(point);

            const a = camera.solve(A);
            const b = camera.solve(B);

            const Aex = add(A, scale(sub(A, camera.eye), 1)) as vector3;
            const Bex = add(B, scale(sub(B, camera.eye), 1)) as vector3;


            Point.render(p, A, "#000");
            Point.render(p, B, "#000");
            Point.render(p, a!, "#000");
            Point.render(p, b!, "#000");
            Point.render(p, point, "#000");
            Point.render(p, image!, "#000");

            Label.renderLabel(p, A, "A", "#000");
            Label.renderLabel(p, B, "B", "#000");
            Label.renderLabel(p, a!, "a", "#000");
            Label.renderLabel(p, b!, "b", "#000");
            Label.renderLabel(p, point, "P", "#000");
            Label.renderLabel(p, image!, "p", "#000");

            line.render(p);
            camera.renderTrace(p, point, 0, "#000", "#f00", undefined);

            camera.outerRender(p, { });
            camera.innerRender([line]);
            camera.renderImage(p, line);
            Shape.renderShape(p, [Aex, Bex, camera.eye], undefined, "#f001");
            camera.canvasRender(p);
        };
    });
}
