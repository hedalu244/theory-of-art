import type p5_ from "p5";
declare const p5: typeof p5_;
import { Sketch, createP5Sketch } from "../../_script/sketch-helper";
import { LMSColor, monochromaticity, monochromaticityData, toLMS, toP5Color, colorLerp } from "../../_script/color";
import { InputTable } from "../../_script/input";

function plot(lms: LMSColor, x = 200, y = 10, scale = 500): [number, number] {
    // 仮の実装
    return [
        lms.data[0] * scale + x,
        (1 - lms.data[1]) * scale + y
    ];
}

export function create(el: HTMLDivElement): Sketch {
    const inputTable = new InputTable(el);

    const wl1Slider = inputTable.createRangeInput({
        label: "Wavelength 1",
        min: 400,
        max: 700,
        value: 500,
        type: "int",
        width: 200,
        unit: "nm",
    });

    const wl2Slider = inputTable.createRangeInput({
        label: "Wavelength 2",
        min: 400,
        max: 700,
        value: 600,
        type: "int",
        width: 200,
        unit: "nm",
    });

    const mixrate = inputTable.createRangeInput({
        label: "Mix Rate",
        min: 0,
        max: 100,
        type: "int",
        width: 200,
        unit: "%",
    });

    return createP5Sketch(el, (p: p5_) => {
        p.setup = () => {
            p.createCanvas(800, 600);
        };

        p.draw = () => {
            p.background(200);

            // 色域を描画
            p.noStroke();
            p.fill(255);
            p.beginShape();
             for (const data of monochromaticityData) {
                const lms = toLMS(data.color);
                const pos = plot(lms);
                p.vertex(...pos);
            }
            p.endShape(p.CLOSE);
            
            p.strokeWeight(3);
            p.stroke(200);
            let prevPos = null;
            for (const data of monochromaticityData) {
                const lms = toLMS(data.color);
                const pos = plot(lms);
                if (prevPos) {
                    p.stroke(toP5Color(p, data.color));
                    p.line(...prevPos, ...pos);
                }
                prevPos = pos;
            }

            // スライダーの値に基づいて色を計算
            const wl1 = parseFloat(wl1Slider.value);
            const wl2 = parseFloat(wl2Slider.value);
            const rate = parseFloat(mixrate.value) / 100;

            const color1 = monochromaticity(wl1);
            const color2 = monochromaticity(wl2);
            const color3 = colorLerp(color1, color2, rate);

            const color1Pos = plot(toLMS(color1));
            const color2Pos = plot(toLMS(color2));
            const color3Pos = plot(toLMS(color3));

            //console.log(color1, color1inRGB, color1Pos);

            p.stroke(150);
            p.line(...color1Pos, ...color2Pos);

            p.noStroke();
            p.fill(toP5Color(p, color1));
            p.circle(...color1Pos, 20);
            p.fill(toP5Color(p, color2));
            p.circle(...color2Pos, 20);
            p.fill(toP5Color(p, color3));
            p.circle(...color3Pos, 20);
        };
    });
}
