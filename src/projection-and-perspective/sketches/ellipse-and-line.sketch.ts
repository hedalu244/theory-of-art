import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";

export function create(el: HTMLDivElement, options: { roll?: boolean, grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;

        p.setup = () => {
            p.createCanvas(640, 480);
        };

        p.draw = () => {
            const ratio = 0.5;
            const radius = 150;
            const length = 400;
            const t = p.millis() / 1000;
            const angle = p.lerp(0.26, 0.4, (Math.sin(t) * 0.5 + 0.5)) * 2 * Math.PI;

            const pos = [Math.sin(angle) * radius, Math.cos(angle) * radius];
            const slope = -Math.tan(angle);
            const intercept = pos[1] - slope * pos[0];

            p.background(255);
            p.translate(p.width / 2, p.height / 2);

            const N = 64;

            p.noStroke();
            p.fill("#faa");

            p.beginShape();
            p.vertex(-pos[0], pos[1] * ratio);
            p.vertex(pos[0], pos[1] * ratio);
            for (let i = 0; i < N + 1; i++) {
                const theta = i / N * Math.PI * 2;
                if(pos[1] > -Math.cos(theta) * radius) continue;
                p.vertex(Math.sin(theta) * radius, -Math.cos(theta) * radius * ratio);
            }
            p.endShape();

            p.noStroke();
            p.fill("#aaf");

            p.beginShape();
            p.vertex(-pos[0], pos[1] * ratio);
            p.vertex(pos[0], pos[1] * ratio);
            for (let i = 0; i < N + 1; i++) {
                const theta = i / N * Math.PI * 2;
                if(pos[1] < Math.cos(theta) * radius) continue;
                p.vertex(Math.sin(theta) * radius, Math.cos(theta) * radius * ratio);
            }
            p.endShape();
            
            p.stroke("#000");
            p.noFill();

            p.strokeWeight(2);
            p.ellipse(0, 0, radius * 2, radius * 2 * ratio);
            //p.line(0, 0, pos[0], pos[1] * ratio);
            p.line(pos[0], pos[1] * ratio, -pos[0], pos[1] * ratio);
            p.line(0, intercept * ratio, length, intercept * ratio + slope * length * ratio);
            p.line(0, intercept * ratio, -length, intercept * ratio + slope * length * ratio);
        };
    });
}