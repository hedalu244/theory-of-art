import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(0, 0, -300, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
            p.perspective(Math.PI / 2, p.width / p.height, 0.1, 1000);
        };

        const N = 2;

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);

            const r = 80;
            p.strokeWeight(2);
            for (let y = -100; y <= 100; y += 200) {
                for (let i = -N; i <= N; i++) {
                    Circle.renderCircle(p, [r * 2 * i, y, 0], r, [0, 1, 0], "#f00");
                    Segment.renderSegment(p, [r * 2 * i, y - 100, 0], [r * 2 * i, y + 100, 0], "#0a0");
                    Segment.renderSegment(p, [r * (2 * i + 1), y, -100], [r * (2 * i + 1), y, 100], "#000");
                    Segment.renderSegment(p, [r * (2 * i - 1), y, -100], [r * (2 * i - 1), y, 100], "#000");
                }
                Segment.renderSegment(p, [r * (2 * N + 1), y, r], [-r * (2 * N + 1), y, r], "#000");
                Segment.renderSegment(p, [r * (2 * N + 1), y, -r], [-r * (2 * N + 1), y, -r], "#000");
            }
            Point.render(p, [0, 0, 0], "#000");
            p.textSize(16);
            Label.renderLabel(p, [0, 0, 0], "視心", "#000");
        };
    });
}