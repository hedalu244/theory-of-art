import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Line, Box, Sphere, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts"
import { add, scale, vector3 } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let scene: Renderable[] = [];
        let labels: Label[] = [];
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        }

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);
            p.frameRate(30);

            camera = new IdealCamera([200, 0, 0], [-30, 0, 0], 200, 150, p);
            scene.push(new Box([-100, -20, -60], [80, 60, 80], [0, 0.4, 0]));
            scene.push(new Box([-100, 10, 60], [60, 120, 60], [0, -0.3, 0]));

            const posA = [-100, 20, -60] as vector3;
            const solved = camera.solve(posA)!;

            scene.push(new Line(posA, [200, 0, 0], "#000"));
            scene.push(new Point(solved, "#000"));

            // outercamera
            p.camera(500, 500, 500, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            scene.forEach(obj => obj.render(p));

            const t = p.millis() / 1000;
            const point = [100 * Math.cos(t) + 130, 100, 100 * Math.sin(t)] as vector3;
            camera.renderTrace(p, point, 0, 
                "#000", "#f00", "#00f", {
                renderPointLocus: true,
                renderImageLocus: true,
                renderInner: true,
                renderInnerLocus: true,
            });

            camera.outerRender(p);
            labels.forEach(label => label.render(p));
            camera.innerRender(scene);
            camera.canvasRender(p);
        };
    });
}
