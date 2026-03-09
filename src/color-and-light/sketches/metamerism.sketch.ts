import type p5_ from "p5";
declare const p5: typeof p5_;
import { LMSColor, monochromaticity, monochromaticityData, toLMS, RGBColor, toRGB, colorGain, colorAdd, toP5Color } from "../../_script/color";
import { InputTable } from "../../_script/input";

function plot(lms: LMSColor, x = 200, y = 10, scale = 500): [number, number] {
    // 仮の実装
    const sum = lms.data[0] + lms.data[1] + lms.data[2];
    const normalzed = sum != 0 ? [
        lms.data[0] / sum,
        lms.data[1] / sum,
        lms.data[2] / sum,
    ] : [1 / 3, 1 / 3, 1 / 3];
    return [
        normalzed[0] * scale + x,
        (1 - normalzed[1]) * scale + y
    ];
}

function drawGamut(p: p5_, plotParam: [number, number, number], options: {
    fillColor?: p5_.Color,
    strokeColor?: p5_.Color,
    strokeWeight?: number,
}) {
    if (!options.strokeWeight)
        options.strokeWeight = 2;

    // 色域を描画
    p.noStroke();
    if (options.fillColor) {
        p.fill(options.fillColor);
        p.beginShape();
        for (const data of monochromaticityData) {
            const lms = toLMS(data.color);
            const pos = plot(lms, ...plotParam);
            p.vertex(...pos);
        }
        p.endShape(p.CLOSE);
    }

    p.strokeWeight(options.strokeWeight);
    let prevPos = null;
    for (const data of monochromaticityData) {
        const lms = toLMS(data.color);
        const pos = plot(lms, ...plotParam);
        if (prevPos) {
            if (options.strokeColor)
                p.stroke(options.strokeColor);
            else
                p.stroke(toP5Color(p, data.color));

            p.line(...prevPos, ...pos);
        }
        prevPos = pos;
    }

}

export function create(el: HTMLDivElement, options: {
    allowNegative?: boolean,
    targetWavelength?: number
}) {
    const inputTable = new InputTable(el);
    const gainRSlider = inputTable.createRangeInput({
        label: "Gain R",
        min: options.allowNegative ? -100 : 0,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        unit: "%",
    });

    const gainGSlider = inputTable.createRangeInput({
        label: "Gain G",
        min: options.allowNegative ? -100 : 0,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        unit: "%",
    });

    const gainBSlider = inputTable.createRangeInput({
        label: "Gain B",
        min: options.allowNegative ? -100 : 0,
        max: 100,
        value: 50,
        type: "int",
        width: 200,
        unit: "%",
    });

    const colorTarget = colorGain(toRGB(monochromaticity(options.targetWavelength || 500)), 0.6);
    const colorR = RGBColor(1, 0, 0);
    const colorG = RGBColor(0, 1, 0);
    const colorB = RGBColor(0, 0, 1);

    new p5((p: p5_) => {
        p.setup = () => {
            p.createCanvas(800, 600);
        };

        p.draw = () => {
            p.blendMode(p.BLEND);
            p.background(0);

            const gainR = gainRSlider.valueAsNumber / 100;
            const gainG = gainGSlider.valueAsNumber / 100;
            const gainB = gainBSlider.valueAsNumber / 100;

            const gainedR = colorGain(colorR, gainR);
            const gainedG = colorGain(colorG, gainG);
            const gainedB = colorGain(colorB, gainB);
            const colorMixed = colorAdd(gainedR, colorAdd(gainedG, gainedB));

            const gainedAbsR = colorGain(colorR, Math.abs(gainR));
            const gainedAbsG = colorGain(colorG, Math.abs(gainG));
            const gainedAbsB = colorGain(colorB, Math.abs(gainB));

            const plotParam = [500, -50, 300] as [number, number, number];
            drawGamut(p, plotParam, { fillColor: p.color(50), strokeWeight: 2 });

            const plotG = plot(toLMS(colorG), ...plotParam);
            const plotR = plot(toLMS(colorR), ...plotParam);
            const plotB = plot(toLMS(colorB), ...plotParam);
            const plotTarget = plot(toLMS(colorTarget), ...plotParam);
            const plotMixed = plot(toLMS(colorMixed), ...plotParam);

            p.strokeWeight(1);
            p.stroke(255);
            p.line(...plotR, ...plotB);
            p.line(...plotB, ...plotG);
            p.line(...plotG, ...plotR);
            p.line(...plotR, ...plotMixed);
            p.line(...plotG, ...plotMixed);
            p.line(...plotB, ...plotMixed);

            p.noStroke();
            p.fill(toP5Color(p, colorG));
            p.circle(...plotG, 10);
            p.fill(toP5Color(p, colorR));
            p.circle(...plotR, 10);
            p.fill(toP5Color(p, colorB));
            p.circle(...plotB, 10);
            p.fill(toP5Color(p, colorTarget));
            p.circle(...plotTarget, 10);
            p.fill(toP5Color(p, colorMixed));
            p.circle(...plotMixed, 10);


            const wallsize = 100;
            const wallCenter = [250, 200] as [number, number];
            const wallLeft = [wallCenter[0] - wallsize, wallCenter[1] - wallsize] as [number, number];
            const wallRight = [wallCenter[0] + wallsize, wallCenter[1] - wallsize] as [number, number];

            const wallsize2 = 50;
            const wallLeft2 = [wallCenter[0] - wallsize2, wallCenter[1] - wallsize2] as [number, number];
            const wallRight2 = [wallCenter[0] + wallsize2, wallCenter[1] - wallsize2] as [number, number];

            const lightOffset = 20;
            const lightDistance = 200;
            const lightPosTarget = [wallCenter[0] - lightDistance, wallCenter[1] + lightDistance] as [number, number];

            const lightPosG = [wallCenter[0] + lightDistance, wallCenter[1] + lightDistance] as [number, number];
            const lightPosR = [lightPosG[0] - lightOffset, lightPosG[1] + lightOffset] as [number, number];
            const lightPosB = [lightPosG[0] + lightOffset, lightPosG[1] - lightOffset] as [number, number];

            const lightPosNegG = [wallCenter[0] - lightDistance - lightOffset, wallCenter[1] + lightDistance - lightOffset] as [number, number];
            const lightPosNegR = [lightPosNegG[0] + 2 * lightOffset, lightPosNegG[1] + 2 * lightOffset] as [number, number];
            const lightPosNegB = [lightPosNegG[0] - lightOffset, lightPosNegG[1] - lightOffset] as [number, number];


            const displayPosX = 650;
            const displayPosY = 400;
            const displaySizeRGB = 150;
            const displaySizeTarget = 130;
            const displayOffset = 20;


            p.stroke(255);
            p.strokeWeight(3);
            p.line(...wallLeft, ...wallCenter);
            p.line(...wallRight, ...wallCenter);


            // 本来は線形空間で足すべきだが、rgbが完全に別チャネルであれば非線形性は問題にならないので、簡易実装
            p.blendMode(p.ADD);
            p.noStroke();

            if (0 <= gainR) {
                p.fill(toP5Color(p, colorR));
                p.circle(...lightPosR, 10);
                p.fill(toP5Color(p, gainedAbsR));
                p.arc(displayPosX, displayPosY - displayOffset, displaySizeRGB, displaySizeRGB, 1.5 * Math.PI, 2.5 * Math.PI, p.PIE);
                p.triangle(...wallRight2, ...wallCenter, ...lightPosR);
            } else {
                p.fill(toP5Color(p, colorR));
                p.circle(...lightPosNegR, 10);
                p.fill(toP5Color(p, gainedAbsR));
                p.arc(displayPosX, displayPosY - displayOffset, displaySizeRGB, displaySizeRGB, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
                p.triangle(...wallLeft2, ...wallCenter, ...lightPosNegR);
            }

            if (0 <= gainG) {
                p.fill(toP5Color(p, colorG));
                p.circle(...lightPosG, 10);
                p.fill(toP5Color(p, gainedAbsG));
                p.arc(displayPosX, displayPosY, displaySizeRGB, displaySizeRGB, 1.5 * Math.PI, 2.5 * Math.PI, p.PIE);
                p.triangle(...wallRight2, ...wallCenter, ...lightPosG);
            } else {
                p.fill(toP5Color(p, colorG));
                p.circle(...lightPosNegG, 10);
                p.fill(toP5Color(p, gainedAbsG));
                p.arc(displayPosX, displayPosY, displaySizeRGB, displaySizeRGB, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
                p.triangle(...wallLeft2, ...wallCenter, ...lightPosNegG);
            }

            if (0 <= gainB) {
                p.fill(toP5Color(p, colorB));
                p.circle(...lightPosB, 10);
                p.fill(toP5Color(p, gainedAbsB));
                p.arc(displayPosX, displayPosY + displayOffset, displaySizeRGB, displaySizeRGB, 1.5 * Math.PI, 2.5 * Math.PI, p.PIE);
                p.triangle(...wallRight2, ...wallCenter, ...lightPosB);
            } else {
                p.fill(toP5Color(p, colorB));
                p.circle(...lightPosNegB, 10);
                p.fill(toP5Color(p, gainedAbsB));
                p.arc(displayPosX, displayPosY + displayOffset, displaySizeRGB, displaySizeRGB, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
                p.triangle(...wallLeft2, ...wallCenter, ...lightPosNegB);
            };

            p.fill(toP5Color(p, colorTarget));
            p.circle(...lightPosTarget, 10);
            p.arc(displayPosX, displayPosY, displaySizeTarget, displaySizeTarget, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
            p.triangle(...wallLeft2, ...wallCenter, ...lightPosTarget);

            // 負の領域の描画を試み
            p.filter(p.INVERT);
            p.fill(toP5Color(p, colorGain(colorTarget, -1)));
            p.circle(...lightPosTarget, 10);
            p.arc(displayPosX, displayPosY, displaySizeTarget, displaySizeTarget, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
            p.triangle(...wallLeft2, ...wallCenter, ...lightPosTarget);
            p.filter(p.INVERT);
        }
    }, el);
}
