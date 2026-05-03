import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment } from "./objects.ts";
import { sequenceNumber } from "./sequence.ts";


export function create(el: HTMLDivElement, options: { roll?: boolean, concentric?: boolean; mode?: "square" | "parallel"; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(0, 200, 0, 0, 0, 0, 0, 0, -1); // Position, LookAt, Up
            p.perspective(60 * Math.PI / 180, 640 / 480, 1, 1000);
        };

        p.draw = () => {
            const t = p.millis() / 1000 % 6;

            p.background(255);
            //p.orbitControl();

            const angle = sequenceNumber([0, 1], p.millis(), 1000, 2000);

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

            p.fill("#aaf");
            p.noStroke();
            p.beginShape();
            for (let i = 0; i < N + 1; i++) {
                const theta = i / N * Math.PI;
                p.vertex(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
            }
            p.endShape();

            Segment.renderSegment(p, [radius, 1, 0], [-radius, 1, 0], "#000");
            const radius2 = radius * (Math.sin(t * Math.PI) * 0.2 + 0.6);
            const radius3 = radius * (Math.sin(t * Math.PI) * 0.1 + 0.8);

            const radii = options.concentric ? [radius, radius2, radius3] : [radius];

            for (let r of radii) {
                Circle.renderCircle(p, [0, 0, 0], r, [0, 1, 0], "#000");

                if (options.mode === "parallel") {
                    Segment.renderSegment(p, [r, 0, -length], [r, 0, length], "#000");
                    Segment.renderSegment(p, [-r, 0, -length], [-r, 0, length], "#000");
                }

                if (options.mode === "square") {
                    Segment.renderSegment(p, [r, 0, r], [r, 0, -r], "#000");
                    Segment.renderSegment(p, [r, 0, -r], [-r, 0, -r], "#000");
                    Segment.renderSegment(p, [-r, 0, -r], [-r, 0, r], "#000");
                    Segment.renderSegment(p, [-r, 0, r], [r, 0, r], "#000");
                    // 対角線
                    Segment.renderSegment(p, [r, 0, r], [-r, 0, -r], "#000");
                    Segment.renderSegment(p, [r, 0, -r], [-r, 0, r], "#000");
                }
            }
        };
    });
}