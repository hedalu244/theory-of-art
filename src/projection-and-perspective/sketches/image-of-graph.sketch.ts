import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Circle } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts"

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let scene: Renderable[] = [];
        let labels: Renderable[] = [];
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        }

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);

            scene.push(new Circle([10, 0, 100], 40, [0, 0, 1]));

            scene.push(new Circle([-20, 0, 200], 80, [0, 0, 1]));

            // outercamera
            p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0); // Position, LookAt, Up
        };

        p.draw = () => {
            p.background(255);

            p.orbitControl();

            scene.forEach(obj => obj.render(p));
            
            camera.outerRender(p);
            labels.forEach(label => label.render(p));
            camera.innerRender(scene);
            camera.canvasRender(p);
        };
    });
}
