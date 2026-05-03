import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper.ts";
import { Renderable, Label, Circle, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";
import { vector3 } from "../../_script/linearalgebra.ts";

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let scene: Renderable[] = [];
        let labels: Renderable[] = [];
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);
            
            scene.push(new Circle([-20, 0, 200], 80, [0, 0, 1], "#e00"));
            scene.push(new Circle([10, 0, 100], 40, [0, 0, 1], "#0a0"));

            const up = [0, 1, 0] as vector3;
            const right = [1, 0, 0] as vector3;

            labels.push(new Label([-35, 5, 200], "図形S", "#e00", up, right));
            labels.push(new Label([-5, 5, 100], "図形S'", "#0a0", up, right));

            // outercamera
            p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            scene.forEach(obj => obj.render(p));

            const A: vector3 = [-80, 0, 200];
            const a: vector3 = camera.solve(A)!;
            const B: vector3 = [40, 0, 100];

            camera.renderTrace(p, A, 0, "#e00", "#e00", undefined, {renderInner: true});
            camera.renderTrace(p, B, 0, "#0a0", "#0a0", undefined, {renderInner: true, extension: 130});

            Label.renderLabel(p, A, "点A", "#000");
            Label.renderLabel(p, B, "点b", "#000");
            Label.renderLabel(p, a, "点a", "#000");

            camera.outerRender(p);
            labels.forEach(label => label.render(p));
            camera.innerRender(scene);
            camera.canvasRender(p);
        };
    });
}
