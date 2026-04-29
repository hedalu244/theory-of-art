import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { isInGamut, LMSColor, toP5Color } from "../../_script/color";

function plot(color: LMSColor): [number, number, number] {
    const x = color.data[0] * 300;
    const y = color.data[1] * 300;
    const z = color.data[2] * 300;
    return [x, y, z];
}

export function create(el: HTMLDivElement): Sketch {
    return createP5Sketch(el, (p: p5_) => {
        const pointtoplot: LMSColor[] = Array.from({ length: 500 }).map(() => LMSColor(Math.random(), Math.random(), Math.random()));

        p.setup = () => {
            p.createCanvas(600, 600, p.WEBGL);
        };

        p.draw = () => {
            p.background(230);
            // p.rotateX(p.millis() / 2000);
            // p.rotateY(p.millis() / 3000);
            p.orbitControl();
            p.translate(-150, -150, -150);

            // Draw axes
            p.strokeWeight(3);
            p.stroke(255, 0, 0);
            p.line(-100, 0, 0, 300, 0, 0);
            p.stroke(0, 255, 0);
            p.line(0, -100, 0, 0, 300, 0);
            p.stroke(0, 0, 255);
            p.line(0, 0, -100, 0, 0, 300);

            p.stroke(200);
            p.line(0, 0, 0, 300, 300, 300);
            const size = 8;

            for (const lms of pointtoplot) {
                if (isInGamut(lms)) {
                    p.push();
                    p.translate(...plot(lms));
                    p.fill(toP5Color(p, lms));
                    p.noStroke();
                    p.box(size, size, size);
                    p.pop();
                }
            }

            /*
            for (let l = 0; l <= 1; l += 0.05) {
                for (let m = 0; m <= 1; m += 0.05) {
                    for (let s = 0; s <= 1; s += 0.05) {
                        const lms = LMSColor(l, m, s);

                        if (isInGamut(lms)) {
                            p.push();
                            p.translate(...plot(lms));
                            p.fill(toP5Color(p, lms));
                            p.noStroke();
                            p.box(size, size, size);
                            p.pop();

                        }
                    }
                }
            }*/
        };
    });
}
