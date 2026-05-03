import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Circle, Segment } from "./objects.ts";

export function create(el: HTMLDivElement, options: { roll?: boolean, grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(-300, 300, -300, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);
            p.orbitControl();

            if (options.roll) p.rotateZ(t);
            else p.rotateY(t);

            Circle.renderCircle(p, [0, 0, 0], 80, [0, 1, 0], "#000");
            Segment.renderSegment(p, [0, -100, 0], [0, 100, 0], "#000");

            if (options.grid) {
                let N = 3;
                const size = 40;
                const length = size * N;

                for (let i = -3; i <= 3; i++) {
                    Segment.renderSegment(p, [i * size, 0, length], [i * size, 0, -length], "#aaa");
                    Segment.renderSegment(p, [length, 0, i * size], [-length, 0, i * size], "#aaa");
                }
            }
        };
    });
}