import type p5_ from "p5";
declare const p5: typeof p5_;

export function create(el: HTMLDivElement) {
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "90";
    input.value = "45";
    el.appendChild(input);
    el.appendChild(document.createElement("br"));
    
    new p5((p: p5_) => {
        p.setup = () => {
            p.createCanvas(400, 300, p.WEBGL);
        };

        p.draw = () => {
            p.background(230);
            p.rotateY(input.valueAsNumber * p.PI / 180);
            p.box(100);
        };
    }, el);
}
