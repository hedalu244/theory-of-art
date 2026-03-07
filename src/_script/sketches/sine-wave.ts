import type p5_ from "p5";
declare const p5: typeof p5_;

export function create(el: HTMLDivElement) {
    new p5((p: p5_) => {
        p.setup = () => {
            p.createCanvas(800, 600);
        };

        p.draw = () => {
            p.background(255);
            const phase = -(p.millis() / 1000) * 2 * p.PI * 0.5;
            const amplitude = 100;
            const frequency = 0.01;
            
            // 正弦波を描画
            p.stroke(0);
            p.noFill();
            p.beginShape();
            for (let x = 0; x < p.width; x++) {
                const y = p.height / 2 + amplitude * Math.sin(frequency * x + phase);
                p.vertex(x, y);
            }
            p.endShape();

            // x軸
            p.line(0, p.height / 2, p.width, p.height / 2);
            // y軸
            p.line(30, 0, 30, p.height);
        };
    }, el);
}