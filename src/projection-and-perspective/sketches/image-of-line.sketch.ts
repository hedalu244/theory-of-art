import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Segment, Box, Sphere, Point, Shape } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";
import { vector3, add, scale, sub, mag, cross, dot } from "../../_script/linearalgebra.ts";
import { InputTable, createElement } from "../../_script/input.ts";

function PlaneAndLineInterSect(planePoint: vector3, planeNormal: vector3, linePoint: vector3, lineDir: vector3): vector3 | undefined {
    const denom = dot(planeNormal, lineDir);
    if (Math.abs(denom) < 1e-6) {
        return undefined; // 平面と線が平行な場合は交点なし
    }
    const t = dot(sub(planePoint, linePoint), planeNormal) / denom;
    return add(linePoint, scale(lineDir, t));
}

export function create(el: HTMLDivElement, options: {
    virtual?: boolean;
}): Sketch {
    const span = createElement("span");
    el.appendChild(span);

    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;
        let line: Segment;

        p.preload = () => {
            Label.loadFont(p);
        };

        const vec = [-1.2, 1, 3] as vector3;
        const pos = cross(vec,[-5, -5, -5] as vector3);
        const eye = [0, 0, 0] as vector3;
        const A = sub(pos, scale(vec, 100)) as vector3;
        const B = add(pos, scale(vec, 100)) as vector3;
        const C = sub(scale(pos, 10), scale(vec, 100)) as vector3;
        const D = add(scale(pos, 10), scale(vec, 100)) as vector3;
        const E = sub(eye, scale(vec, 100)) as vector3;
        const F = add(eye, scale(vec, 100)) as vector3;

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera(eye, [0, 0, 100], 200, 150);
            line = new Segment(A, B, "#000");
            // outercamera
            p.camera(-300, 300, -200, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            const x = Math.abs(p.millis() / 3000 % 2 - 1);
            let t = Math.tan((x - 0.5) * Math.PI) * mag(sub(eye, pos));
            if (!isFinite(t)) t = 100 * Math.sign(x);
            const point = add(pos, scale(vec, t) as vector3);
            const image = camera.solve(point);
            const v_image = camera.solve_virtual(point);

            const intersect = PlaneAndLineInterSect(camera.target, sub(camera.target, camera.eye), pos, vec);
            const vanish = PlaneAndLineInterSect(camera.target, sub(camera.target, camera.eye), camera.eye, vec);
            // Label.renderLabel(p, pos, "l", "#000");
            Label.renderLabel(p, point, "P", "#000");
            
            Point.render(p, intersect!, "#000");
            Point.render(p, vanish!, "#000");
            Label.renderLabel(p, intersect!, "A", "#000");
            Label.renderLabel(p, vanish!, "V", "#000");
            
            if(image) Label.renderLabel(p, image, "p", "#000");
            if(options.virtual && v_image) Label.renderLabel(p, v_image, "p", "#000");

            line.render(p);
            camera.renderTrace(p, point, 0, "#000", "#f00", options.virtual? "#00f":undefined, {
                renderImageLocus: true,
            });

            camera.outerRender(p, { critical: true });
            //camera.renderImage(p, line);
            Shape.renderShape(p, [C, D, F, E], undefined, "#f001");
            camera.canvasRender(p);
        };
    });
}
