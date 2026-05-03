import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Label, Circle, Segment, Renderable, Sphere, Point } from "./objects.ts";
import { add, cross, normalize, scale, vector3 } from "../../_script/linearalgebra.ts";

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

// find xy line s.t. cross([x,y,z], normal) = 0
function planeIntersect(normal: vector3, z: number, color: string): Segment {
    normal = normalize(normal);
    const d = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
    if (d === 0) return new Segment([0, 0, z], [0, 0, z], color);
    const vec = cross(normal, [0, 0, 1] as vector3);
    let pos = cross(normal, vec);
    pos = scale(pos, z / pos[2]);
    //const pos = [normal[1] / d * z,  -normal[0] / d * z, z] as vector3;

    return new Segment(add(pos, scale(vec, -1000)), add(pos, scale(vec, 1000)), color);
};

// 0 centered, radius r, normal vector, color
function renderHemicircle(p: p5_, normal: vector3, r: number, upperColor: string, lowerColor: string) {
    normal = normalize(normal);
    const N = 32;
    const axis1 = normalize(cross(normal, [0, 0, 1] as vector3));
    if (axis1[0] === 0 && axis1[1] === 0 && axis1[2] === 0) {
        axis1[0] = 1;
    }
    const axis2 = normalize(cross(normal, axis1));

    let offset = 0;
    for (let color of [lowerColor, upperColor]) {
        p.stroke(color);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < N + 1; i++) {
            const theta = i / N * Math.PI + offset;
            const pos = add(scale(axis1, Math.cos(theta) * r), scale(axis2, Math.sin(theta) * r));
            p.vertex(pos[0], pos[1], pos[2]);
        }
        p.endShape();
        offset += Math.PI;
    }
}

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        p.preload = () => {
            Label.loadFont(p);
        };
        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.camera(-300, -300, -300, 0, 0, 0, 0, 0, 1); // Position, LookAt, Up
        };

        const lineNum = 4;
        const seed = [0, 100, 200, 300, 400];
        const lowerColors = ["#f00", "#0a0", "#00f", "#aa0", "#0aa"];
        const upperColors = ["#faa", "#afa", "#aaf", "#ffa", "#aff"];

        p.draw = () => {
            const t = p.millis() / 1000;

            p.background(255);
            p.orbitControl();

            const r = 80;
            p.strokeWeight(2);
            for (let i = 0; i < lineNum; i++) {
                const rollAngle = p.noise(seed[i], t / 100) * Math.PI * 2 * 10;
                const tiltAngle = p.noise(seed[i] + 1000, t / 100) * Math.PI * 2 * 10;
                const normal = rotateVector(rotateVector([0, 0, 1], tiltAngle, [0, 1, 0]), rollAngle, [0, 0, 1]);

                renderHemicircle(p, normal, r, lowerColors[i], upperColors[i]);
                planeIntersect(normal, r, lowerColors[i]).render(p);
            }

            let N = 3;
            const size = 40;
            const length = size * N;

            for (let i = -3; i <= 3; i++) {
                p.strokeWeight(1);
                Segment.renderSegment(p, [i * size, length, r], [i * size, -length, r], "#aaa");
                Segment.renderSegment(p, [length, i * size, r], [-length, i * size, r], "#aaa");
            }
            Circle.renderCircle(p, [0, 0, 0], r, [0, 0, 1], "#000");
            Point.render(p, [0, 0, 0], "#000");
            Sphere.render(p, [0, 0, 0], r - 1, "#ddda");
        };
    });
}