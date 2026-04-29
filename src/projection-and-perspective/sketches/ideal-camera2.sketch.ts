import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Line, Box, Sphere, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts"
import { vector3, add, scale, sub } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let scene: Renderable[] = [];
        let labels: Renderable[] = [];
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        }

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([200, 0, 0], [30, 0, 0], 200, 150, p);

            // outercamera
            p.camera(500, 500, 500, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            const t = p.millis() / 1000;
            const point = [Math.sin(t) * 50 - 100, Math.sin(t * 2) * 50, Math.sin(t * 3) * 50] as vector3;

            camera.renderTrace(p, point, 0, {
                renderInner: true,
                renderImageLocus: true,
                renderPointLocus: true,
                renderInnerLocus: true,
            });

            camera.outerRender(p, { target: false, axis: false, axislabel: false });
            labels.forEach(label => label.render(p));
            camera.canvasRender(p);
        };
    });
}
