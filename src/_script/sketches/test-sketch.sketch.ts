import type p5_ from "p5";
import { Sketch, createP5Sketch } from "../sketch-helper";

export function create(el: HTMLDivElement, option: {id: string}): Sketch {
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "90";
    input.value = "45";
    el.appendChild(input);
    el.appendChild(document.createElement("br"));
    
    return createP5Sketch(el, (p: p5_) => {
        p.setup = () => {
            p.createCanvas(400, 300, p.WEBGL);
        };

        p.draw = () => {
            p.background(230);
            p.rotateY(input.valueAsNumber * p.PI / 180);
            p.box(100);
            console.log("rendered", option.id)
        };
    });
}
