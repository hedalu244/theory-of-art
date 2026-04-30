import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { Renderable, Label, Line, Box, Sphere, Point } from "./objects.ts";
import { IdealCamera } from "./idealCamera.ts";
import { vector3, add, scale, sub } from "../../_script/linearalgebra.ts";

type Mode = "roll" | "pan-tilt" | "random" | "parallel" | "zoom" | "dolly-zoom";
type WhatToMove = "camera" | "objects" | "both";

export function create(el: HTMLDivElement, options: {
    mode?: Mode,
    whatToMove?: WhatToMove,
}): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        let objects: Renderable[] = [];
        let grid: Renderable[] = [];
        let camera: IdealCamera;

        p.preload = () => {
            Label.loadFont(p);
        };

        p.setup = () => {
            p.createCanvas(640, 480, p.WEBGL);

            objects.push(new Box([-80, -20, -60], [80, 60, 80], [0, 0.4, 0]));
            objects.push(new Box([-130, 10, 60], [60, 120, 60], [0, -0.1, 0]));
            objects.push(new Box([-10, -50, 20], [30, 20, 30], [0, -0.6, 0]));

            const gridY = -30;
            for (let x = -200; x <= 200; x += 50) {
                grid.push(new Line([x, gridY, -200], [x, gridY, 200], "#ccc"));
                grid.push(new Line([-200, gridY, x], [200, gridY, x], "#ccc"));
            }

            camera = new IdealCamera([100, 0, 0], [-30, 0, 0], 200, 150, p);
            // outercamera
            p.camera(500, 500, -500, 0, 0, 0, 0, -1, 0); // Position, LookAt, Up

            p.noiseDetail(2, 0.5);
        };

        p.draw = () => {
            const phase = (p.millis() / 6000) % 1 * 2 * Math.PI;

            const mode = options.mode || "roll";
            const whatToMove = options.whatToMove || "camera";

            if (options.mode == "zoom" || options.mode == "dolly-zoom") {
                const distance = Math.sin(phase) * 50 + 130;
                if (options.mode == "dolly-zoom") {
                    camera.eye[0] = camera.target[0] + distance;
                }
                if (options.mode == "zoom") {
                    camera.target[0] = camera.eye[0] - distance;
                }
            }
            const rollAngle = phase;
            const panAngle = Math.sin(phase) * 0.2;
            const tiltAngle = Math.sin(phase * 2) * 0.2;
            //const offsetAmount = Math.sin(4 * Math.PI * phase - Math.sin(4 * Math.PI * phase)) * 30;
            const offsetAmount = 40 - Math.cos(phase * 2) * 40;
            const pallalelOffset: vector3 = phase < Math.PI ? [offsetAmount, 0, 0] : [0, 0, offsetAmount];

            const t = p.millis() / 1000 * 0.5;
            const randomOffset: vector3 = [
                p.noise(t, 0) * 2 - 1,
                p.noise(0, t) * 2 - 1,
                p.noise(t, t) * 2 - 1,
            ].map(x => x * 50) as vector3;
            const randomRotation: vector3 = [
                p.noise(t + 100, 0) * 2 - 1,
                p.noise(0, t + 100) * 2 - 1,
                p.noise(t + 100, t + 100) * 2 - 1,
            ].map(x => x * Math.PI * 0.3) as vector3;

            p.background(255);
            p.orbitControl();

            p.push();
            if (whatToMove == "objects" || whatToMove == "both") {
                if (mode == "roll") {
                    p.rotateX(rollAngle);
                }
                if (mode == "pan-tilt") {
                    p.translate(...camera.eye);
                    p.rotateZ(tiltAngle);
                    p.rotateY(panAngle);
                    p.translate(...scale(camera.eye, -1));
                }
                if (mode == "parallel") {
                    p.translate(...pallalelOffset);
                }
                if (mode == "random") {
                    p.rotateX(randomRotation[0]);
                    p.rotateY(randomRotation[1]);
                    p.rotateZ(randomRotation[2]);
                    p.translate(...randomOffset);
                }
            }
            objects.forEach(obj => obj.render(p));
            p.pop();

            //grid.forEach(line => line.render(p));

            p.push();
            if (whatToMove == "camera" || whatToMove == "both") {
                if (mode == "roll") {
                    p.rotateX(rollAngle);
                }
                if (mode == "pan-tilt") {
                    p.translate(...camera.eye);
                    p.rotateZ(tiltAngle);
                    p.rotateY(panAngle);
                    p.translate(...scale(camera.eye, -1));
                }
                if (mode == "parallel") {
                    p.translate(...pallalelOffset);
                }
                if (mode == "random") {
                    p.rotateX(randomRotation[0]);
                    p.rotateY(randomRotation[1]);
                    p.rotateZ(randomRotation[2]);
                    p.translate(...randomOffset);
                }
            }
            camera.outerRender(p);
            p.pop();

            if (whatToMove == "camera" || whatToMove == "both") {
                if (mode == "roll") {
                    camera.innerCanvas!.rotateX(-rollAngle);
                }
                if (mode == "pan-tilt") {
                    camera.innerCanvas!.translate(...camera.eye);
                    camera.innerCanvas!.rotateY(-panAngle);
                    camera.innerCanvas!.rotateZ(-tiltAngle);
                    camera.innerCanvas!.translate(...scale(camera.eye, -1));
                }
                if (mode == "parallel") {
                    camera.innerCanvas!.translate(...scale(pallalelOffset, -1));
                }

                if (mode == "random") {
                    camera.innerCanvas!.translate(...scale(randomOffset, -1));
                    camera.innerCanvas!.rotateZ(-randomRotation[2]);
                    camera.innerCanvas!.rotateY(-randomRotation[1]);
                    camera.innerCanvas!.rotateX(-randomRotation[0]);
                }
            }
            //camera.innerRender(grid);
            if (whatToMove == "objects" || whatToMove == "both") {
                if (mode == "roll") {
                    camera.innerCanvas!.rotateX(rollAngle);
                }
                if (mode == "pan-tilt") {
                    camera.innerCanvas!.translate(...camera.eye);
                    camera.innerCanvas!.rotateZ(tiltAngle);
                    camera.innerCanvas!.rotateY(panAngle);
                    camera.innerCanvas!.translate(...scale(camera.eye, -1));
                }
                if (mode == "parallel") {
                    camera.innerCanvas!.translate(...pallalelOffset);
                }
                if (mode == "random") {
                    camera.innerCanvas!.rotateX(randomRotation[0]);
                    camera.innerCanvas!.rotateY(randomRotation[1]);
                    camera.innerCanvas!.rotateZ(randomRotation[2]);
                    camera.innerCanvas!.translate(...randomOffset);
                }
            }
            camera.innerRender(objects);
            camera.innerCanvas!.resetMatrix(); // なぜかpopは壊れる
            camera.canvasRender(p);
        };
    });
}
