import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Renderable as Shape, Label, Circle, Point, Segment } from "./objects.ts";
import { IdealCamera, resetAs2D } from "./idealCamera.ts";
import { vector3 } from "../../_script/linearalgebra.ts";
import { sequenceNumber } from "./sequence.ts";

export function create(el: HTMLDivElement, options: {virtual: boolean}): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);

            // outercamera
            p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);
            p.orbitControl();

            const t = p.millis() / 1000 - 2 + 12;

            const a = 60;
            const r = 200;
            const y = -40;

            const z = sequenceNumber([a, 0, -a, 0], p.millis(), 4000, 1000); 

            const lines = [] as Segment[];
            const virtualLines = [] as Segment[];

            const N = 16;
            for (let i = 0; i < N; i++) {
                const theta = (i + 0.5) / N * 2 * Math.PI;
                lines.push(new Segment([0, y, z], [Math.cos(theta) * r, y, z + Math.sin(theta) * r], "#e00", 16));
                virtualLines.push(new Segment([0, -y, -z], [Math.cos(theta) * r, -y, -z + Math.sin(theta) * r], "#00f", 8));
            }

            lines.forEach(obj => obj.render(p));
            lines.forEach(obj => camera.renderImage(p, obj));
            if(options.virtual) virtualLines.forEach(obj => camera.renderImage(p, obj));
            camera.outerRender(p, { critical: true });
            camera.innerRender(lines);
            if(options.virtual) camera.innerRender(virtualLines);
            camera.canvasRender(p);
        };
    });
}
