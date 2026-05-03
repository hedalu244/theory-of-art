import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Circle, Segment } from "./objects.ts";

export function create(el: HTMLDivElement, options: { roll?: boolean, grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {

        p.setup = () => {
            p.createCanvas(480, 1000, p.WEBGL);
            p.camera(0, 0, -300, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
            p.perspective(120 * Math.PI / 180);
        };

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);

            const N = 10;
            const space = 80;
            const r = 80;

            const circleColor = "#000"
            const segmentColor = "#aaa"

            for (let i = -N; i <= N; i++) {
                Circle.renderCircle(p, [0, space * i, 0], r, [0, 1, 0], circleColor);

                Segment.renderSegment(p, [r, space * i, r], [r, space * i, -r], segmentColor);
                Segment.renderSegment(p, [r, space * i, -r], [-r, space * i, -r], segmentColor);
                Segment.renderSegment(p, [-r, space * i, -r], [-r, space * i, r], segmentColor);
                Segment.renderSegment(p, [-r, space * i, r], [r, space * i, r], segmentColor);
            }
            Segment.renderSegment(p, [r, -space * N, r], [r, space * N, r], segmentColor);
            Segment.renderSegment(p, [r, -space * N, -r], [r, space * N, -r], segmentColor);
            Segment.renderSegment(p, [-r, -space * N, r], [-r, space * N, r], segmentColor);
            Segment.renderSegment(p, [-r, -space * N, -r], [-r, space * N, -r], segmentColor);

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