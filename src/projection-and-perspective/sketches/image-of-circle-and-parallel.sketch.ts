import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Line } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";

export function create(el: HTMLDivElement, options: { roll?: boolean, grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {

        let camera: IdealCamera;

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(0, 200, 0, 0, 0, 0, 0, 0, -1); // Position, LookAt, Up
            p.perspective(60 * Math.PI / 180, 640 / 480, 1, 1000);
        };

        p.draw = () => {
            const t = p.millis() / 1000 % 6;

            p.background(255);
            //p.orbitControl();

            const angle = t < 2 ? 0 : 
                            t < 3 ? t % 1 :
                            t < 5 ? 1 : 1 - (t % 1);

             p.rotateX(angle);

            const radius = 80;
            const length = 400;

            const N = 32;
            p.fill("#faa");
            p.noStroke();
            p.beginShape();
            for (let i = 0; i < N + 1; i++) {
                const theta = i / N * Math.PI;
                p.vertex(Math.cos(theta) * radius, 0, -Math.sin(theta) * radius);
            }
            p.endShape();

            p.fill("#aaf")
            p.noStroke();
            p.beginShape();
            for (let i = 0; i < N + 1; i++) {
                const theta = i / N * Math.PI;
                p.vertex(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
            }
            p.endShape();

            Circle.render(p, [0, 0, 0], radius, [0, 1, 0], "#000");
            Line.render(p, [radius, 0, -length], [radius, 0, length], "#000");
            Line.render(p, [-radius, 0, -length], [-radius, 0, length], "#000");
            Line.render(p, [radius, 1, 0], [-radius, 1, 0], "#000");
        };
    });
}