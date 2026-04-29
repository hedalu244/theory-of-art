import type p5_ from "p5";
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { colorGain, colorLerp, RGBColor, toP5Color } from "../../_script/color";
import { InputTable } from "../../_script/input";
declare const p5: typeof p5_;

function fmod(a: number, b: number): number {
    return a - b * Math.floor(a / b);
}

export function create(el: HTMLDivElement, options?: {
    color1?: [number, number, number],
    color2?: [number, number, number],
}): Sketch {
    const color1 = RGBColor(...(options?.color1 ?? [1, 0, 0]));
    const color2 = RGBColor(...(options?.color2 ?? [0, 0, 1]));

    const inputTable = new InputTable(el);
    const gain1Slider = inputTable.createRangeInput({
        label: "gain 1",
        min: 0,
        max: 100,
        type: "int",
        width: 200,
        unit: "%",
    });
    const gain2Slider = inputTable.createRangeInput({
        label: "gain 2",
        min: 0,
        max: 100,
        type: "int",
        width: 200,
        unit: "%",
    });
    const intervalSlider = inputTable.createRangeInput({
        label: "interval",
        min: 1,
        max: 5,
        type: "int",
        width: 200,
    });
    const borderWidthSlider = inputTable.createRangeInput({
        label: "borderWidth",
        min: 1,
        max: 5,
        type: "int",
        width: 200,
    });
    return createP5Sketch(el, (p: p5_) => {
        p.setup = () => {
            p.createCanvas(800, 600);
        };

        p.draw = () => {
            p.background(0);

            const gain1 = gain1Slider.valueAsNumber / 100;
            const gain2 = gain2Slider.valueAsNumber / 100;
            const interval = intervalSlider.valueAsNumber;
            const borderWidth = borderWidthSlider.valueAsNumber;         

            // flicker
            if (p.frameCount % (intervalSlider.valueAsNumber * 2) < intervalSlider.valueAsNumber) {
                p.noStroke();
                p.fill(toP5Color(p, colorGain(color1, gain1)));
            } else {
                p.noStroke();
                p.fill(toP5Color(p, colorGain(color2, gain2)));
            }
            p.circle(250, 300, 200);

            const borderLeft = 500;
            const borderRight = 700;
            const borderTop = 200;
            const borderBottom = 400;

            // border
            for (let i = 0, x = borderLeft; x < borderRight; i += 1, x = borderLeft + i * borderWidth) {
                if(i % 2 === 0) 
                    p.fill(toP5Color(p, colorGain(color1, gain1)));
                else
                    p.fill(toP5Color(p, colorGain(color2, gain2)));

                const width = Math.min(borderWidth, borderRight - x);
                p.rect(x, borderTop, width, borderBottom - borderTop);
            }
        }
    });
}
