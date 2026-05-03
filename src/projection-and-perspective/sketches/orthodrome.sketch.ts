import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment, Renderable, Sphere } from "./objects.ts";
import { vector3 } from "../../_script/linearalgebra.ts";

function rotateVector(v: vector3, angle: number, axis: vector3) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dot = v[0] * axis[0] + v[1] * axis[1] + v[2] * axis[2];
    return [
        cos * v[0] + sin * (axis[1] * v[2] - axis[2] * v[1]) + (1 - cos) * dot * axis[0],
        cos * v[1] + sin * (axis[2] * v[0] - axis[0] * v[2]) + (1 - cos) * dot * axis[1],
        cos * v[2] + sin * (axis[0] * v[1] - axis[1] * v[0]) + (1 - cos) * dot * axis[2],
    ] as vector3;
}

export function create(el: HTMLDivElement, options: { grid?: boolean; }): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.preload = () => {
            Label.loadFont(p);
        };
        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(-300, -300, -300, 0, 0, 0, 0, 0, 1); // Position, LookAt, Up
        };

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);
            p.orbitControl();

            const rollAngle = t;
            const tiltAngle = t / 2;

            const r = 80;
            const cos = 0.707;
            const sin = Math.sqrt(1 - cos * cos);
            p.push();
            p.rotateZ(rollAngle);
            p.rotateX(tiltAngle);
            p.strokeWeight(2);
            Circle.renderCircle(p, [0, 0, 0], r, [0, 1, -0.5], "#f00");
            Circle.renderCircle(p, [0, 0, 0], r, [0, 1, 0.5], "#0a0");
            Circle.renderCircle(p, [0, 0, r * cos], r * sin, [0, 0, 1], "#00f");
            p.pop();

            if (options.grid) {
                let N = 3;
                const size = 40;
                const length = size * N;

                for (let i = -3; i <= 3; i++) {
                    p.strokeWeight(1);
                    Segment.renderSegment(p, [i * size, length, 0], [i * size, -length, 0], "#aaa");
                    Segment.renderSegment(p, [length, i * size, 0], [-length, i * size, 0], "#aaa");
                }
            }

            Sphere.render(p, [0, 0, 0], r - 1, "#ddda");
        };
    });
}