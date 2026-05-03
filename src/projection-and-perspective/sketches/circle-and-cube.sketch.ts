import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment } from "./objects.ts";
import { vector3 } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement, options: {}): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(300, 200, 100, 0, 0, 0, 0, 0, -1); // Position, LookAt, Up
        };

        function rot3(vec: vector3, i: number): vector3 {
            return [vec[i % 3], vec[(i + 1) % 3], vec[(i + 2) % 3]] as vector3;
        }
        p.draw = () => {
            const colors = ["#f00", "#0a0", "#00f"];

            const t = p.millis() / 1000;

            p.background(255);
            p.orbitControl();
            p.rotateY(t);
            const a = 40;
            const r = 30;

            for (let i = 0; i < 3; i++) {
                const color = colors[i];
                Circle.renderCircle(p, rot3([0, a, 0], i), r, rot3([0, 1, 0], i), color);
                Circle.renderCircle(p, rot3([0, -a, 0], i), r, rot3([0, 1, 0], i), color);

                Segment.renderSegment(p, rot3([a, a, a], i), rot3([a, -a, a], i), color);
                Segment.renderSegment(p, rot3([a, a, -a], i), rot3([a, -a, -a], i), color);
                Segment.renderSegment(p, rot3([-a, a, a], i), rot3([-a, -a, a], i), color);
                Segment.renderSegment(p, rot3([-a, a, -a], i), rot3([-a, -a, -a], i), color);
                Segment.renderSegment(p, rot3([0, 2 * a, 0], i), rot3([0, -2 * a, 0], i), color);
            }

        };
    });
}