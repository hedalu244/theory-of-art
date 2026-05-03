import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Renderable, Label, Circle, Point } from "./objects.ts";
import { IdealCamera, resetAs2D } from "./idealCamera.ts";
import { add, scale, vector3 } from "../../_script/linearalgebra.ts";
import { sequenceNumber } from "./sequence.ts";

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

            const a = 50;
            const r = 40;
            const y = -15;

            const z = sequenceNumber([a, 0, -a, 0], p.millis(), 4000, 1000);

            const circle1 = new Circle([0, y, z + r], r, [0, 1, 0], "#e00");
            const circle2 = new Circle([0, -y, -z - r], r, [0, 1, 0], "#00f");

            const t = p.millis() / 4000 * Math.PI * 2;
            const point = add(circle1.center, scale([Math.cos(t), 0, Math.sin(t)] as vector3, r))

            /*
            if (3 < t % 12 && t % 12 < 9) {
                const N = 16;
                for (let i = 0; i < N; i += 1) {
                    const theta = i / N * 2 * Math.PI;
                    const point = new Point([Math.cos(theta) * r, y, z + Math.sin(theta) * r + r], "#000");
                    camera.renderTrace(p, point.center, 0, "#000", "#e00", "#00f");
                    point.render(p);
                }
            }*/

            camera.renderTrace(p, point, 0, "#000", "#e00", "#00f");

            circle1.render(p);

            camera.outerRender(p, { critical: true });

            camera.renderImage(p, circle1);
            camera.renderImage(p, circle2);

            camera.innerRender([circle1, circle2]);
            camera.canvasRender(p);
            p.push();
            resetAs2D(p);
            p.textSize(30);
            const pos = [20, 200, 0] as vector3;
            if (0 < z) Label.renderLabel(p, pos, "楕円", "#000");
            else if (z < 0) Label.renderLabel(p, pos, "双曲線", "#000");
            else Label.renderLabel(p, pos, "放物線", "#000");
            p.pop();
        };
    });
}
