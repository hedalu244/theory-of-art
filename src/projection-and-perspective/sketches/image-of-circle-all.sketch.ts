import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Renderable, Label, Circle, Point } from "./objects.ts";
import { IdealCamera, resetAs2D } from "./idealCamera.ts";
import { vector3 } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);

            // outercamera
            p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            const t = p.millis() / 1000 - 2 + 12;

            const a = 20;
            const r = 40;
            const y = -15;

            const z =
                (t % 6 < 2) ? Math.cos(t * Math.PI) * a - a :
                    (t % 6 < 3) ? 0 :
                        (t % 6 < 5) ? -Math.cos((t - 3) * Math.PI) * a + a : 0;

            const circle1 = new Circle([0, y, z + r], r, [0, 1, 0], "#e00");
            const circle2 = new Circle([0, -y, -z - r], r, [0, 1, 0], "#00f");


            if (3 < t % 12 && t % 12 < 9) {
                const N = 16;
                for (let i = 0; i < N; i += 1) {
                    const theta = i / N * 2 * Math.PI;
                    const point = new Point([Math.cos(theta) * r, y, z + Math.sin(theta) * r + r], "#000");
                    camera.renderTrace(p, point.center, 0, "#000", "#e00", "#00f");
                    point.render(p);
                }
            }

            circle1.render(p);
            //circle2.render(p);

            camera.outerRender(p, { critical: true });
            camera.innerRender([circle1, circle2]);
            camera.canvasRender(p);
            p.push();
            resetAs2D(p);
            p.textSize(30);
            const pos = [20, 200, 0] as vector3;
            if (0 < z) Label.render(p, pos, "楕円", "#000");
            else if (z < 0) Label.render(p, pos, "双曲線", "#000");
            else Label.render(p, pos, "放物線", "#000");
            p.pop();
        };
    });
}
