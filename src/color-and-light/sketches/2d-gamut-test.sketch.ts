import type p5_ from "p5";
declare const p5: typeof p5_;
import { monochromaticityData, toP5Color, XYZColor, isInGamut } from "../../_script/color";

function plot(xyz: XYZColor, x = 200, y = 10, scale = 500): [number, number] {
    // 仮の実装
    return [
        xyz.data[0] * scale + x,
        (1 - xyz.data[1]) * scale + y
    ];
}

export function create(el: HTMLDivElement) {
    new p5((p: p5_) => {
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
                const pos = plot(data.color);
                p.vertex(...pos);
            }
            p.endShape(p.CLOSE);

            p.strokeWeight(3);
            p.stroke(200);
            let prevPos = null;
            for (const data of monochromaticityData) {
                const pos = plot(data.color);
                if (prevPos) {
                    p.stroke(toP5Color(p, data.color));
                    p.line(...prevPos, ...pos);
                }
                prevPos = pos;
            }

            // スライダーの値に基づいて色を計算
            for (let x = -0.1; x < 1.1; x += 0.05) {
                for (let y = -0.1; y < 1.1; y += 0.05) {

                    const z = 1 - x - y;

                    const color1 = XYZColor(x, y, z);
                    const color1inp5Color = toP5Color(p, color1);

                    const color1Pos = plot(color1);

                    if (isInGamut(color1)) p.noStroke();
                    else p.stroke(0);

                    p.fill(color1inp5Color);
                    p.circle(...color1Pos, 10);
                }
            }
        };
    }, el);
}