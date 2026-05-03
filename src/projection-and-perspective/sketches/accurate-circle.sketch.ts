import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";
import { add, scale, vector3 } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement, options: { roll?: boolean, grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(-300, 300, -300, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);
            p.orbitControl();

            const r = 100;
            Circle.renderCircle(p, [0, 0, 0], r, [0, 1, 0], "#000");
            const A = [r, 0, r];;
            const B = [r, 0, -r];
            const C = [-r, 0, -r];
            const D = [-r, 0, r];

            const P = [0, 0, -r];
            const Q = [-r, 0, 0];
            const R = [0, 0, r];
            const S = [r, 0, 0];

            const corners = [A, B, C, D] as vector3[];
            const edgecenter = [P, Q, R, S] as vector3[];
            for (let i = 0; i < 4; i++) {
                Segment.renderSegment(p, corners[i], corners[(i + 1) % 4], "#000"); // 四辺
                Segment.renderSegment(p, corners[i], edgecenter[i % 4], "#f00");
                Segment.renderSegment(p, corners[i], edgecenter[(i + 1) % 4], "#f00");

                const m1 = scale(add(corners[i], edgecenter[(i + 2) % 4]), 0.5);
                const m2 = scale(add(corners[i], edgecenter[(i + 3) % 4]), 0.5);
                Segment.renderSegment(p, edgecenter[(i + 2) % 4], m2, "#0a0");
                Segment.renderSegment(p, edgecenter[(i + 3) % 4], m1, "#0a0");
            }
            for (let x = -1; x <= 1; x += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    Point.render(p, [x * r * 0.6, 0, z * r * 0.8], "#000");
                    Point.render(p, [x * r * 0.8, 0, z * r * 0.6], "#000");
                }
            }
        };
    });
}