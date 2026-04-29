import type p5_ from "p5";
import { vector3, cross, normalize, sub } from "../../_script/linearalgebra";
declare const p5: typeof p5_;

export interface Renderable {
    render(p: p5_ | p5_.Graphics): void;
}



export class Point implements Renderable {
    center: vector3;
    color: vector3;
    constructor(center: vector3, color: vector3 = [0, 0, 0]) {
        this.center = center;
        this.color = color;
    }

    render(p: p5_ | p5_.Graphics): void {
        Point.render(p, this.center, this.color);
    }

    static render(p: p5_ | p5_.Graphics, center: vector3, color: vector3 = [0, 0, 0]): void {
        p.push();
        p.translate(...center);
        p.fill(...color);
        p.noStroke();
        p.sphere(2, 8, 8);
        p.pop();
    }
}

export class Line implements Renderable {
    start: vector3;
    end: vector3;
    color: vector3;
    constructor(start: vector3, end: vector3, color: vector3 = [0, 0, 0]) {
        this.start = start;
        this.end = end;
        this.color = color;
    }

    render(p: p5_ | p5_.Graphics): void {
        Line.render(p, this.start, this.end, this.color);
    }
    
    static render(p: p5_ | p5_.Graphics, start: vector3, end: vector3, color: vector3): void {
        p.push();
        p.stroke(...color);
        p.line(...start, ...end);
        p.pop();
    }
}

export class Label implements Renderable {
    position: vector3;
    text: string;
    color: vector3;
    up?: vector3;
    right?: vector3;

    static font: p5_.Font | null = null;
    static loadFont(p: p5_) {
        if (!Label.font) {
            Label.font = p.loadFont("/_assets/MPLUS1p-Regular.ttf");
        }
    }

    constructor(position: vector3, text: string, color: vector3 = [0, 0, 0], up?: vector3, right?: vector3) {
        this.position = position;
        this.text = text;
        this.color = color;
        this.up = up ? normalize(up) : undefined;
        this.right = right ? normalize(right) : undefined;
    }
    
    render(p: p5_ | p5_.Graphics): void {
        Label.render(p, this.position, this.text, this.color, this.up, this.right);
    }

    static render(p: p5_ | p5_.Graphics, position: vector3, text: string, color: vector3, up_?: vector3, right_?: vector3): void {
        if(!Label.font) {
            return;
        }

        const up = up_ ? normalize(up_) : undefined;
        const right = right_ ? normalize(right_) : undefined;

        p.push();

        const gl = (p as any)._renderer.GL;
        gl.disable(gl.DEPTH_TEST);
        p.fill(...color);
        p.noStroke();
        p.textFont(Label.font);

        if (up && right) {
            const forward = normalize(cross(right, up));
            p.applyMatrix(
                right[0], right[1], right[2], 0,
                up[0], up[1], up[2], 0,
                forward[0], forward[1], forward[2], 0,
                ...position, 1
            );
            p.text(text, 5, 10);
        }
        else {
            //カメラに向くように回転させるfunction getCameraState(p: p5) {
            const cam = (p as any)._renderer._curCamera as p5_.Camera;
            const eye = [cam.eyeX, cam.eyeY, cam.eyeZ] as vector3;
            const center = [cam.centerX, cam.centerY, cam.centerZ] as vector3;
            const up = [cam.upX, cam.upY, cam.upZ] as vector3;

            const forward = normalize(sub(center, eye));
            const right = normalize(cross(forward, up));
            const trueUp = cross(right, forward);

            p.applyMatrix(
                right[0], right[1], right[2], 0,
                trueUp[0], trueUp[1], trueUp[2], 0,
                -forward[0], -forward[1], -forward[2], 0,
                ...position, 1
            );
            p.text(text, 5, 10);
        }
        
        gl.enable(gl.DEPTH_TEST);
        p.pop();
    }
}

export class Sphere implements Renderable {
    center: vector3;
    radius: number;
    color: vector3;
    constructor(center: vector3, radius: number, color: vector3 = [0, 0, 0]) {
        this.center = center;
        this.radius = radius;
        this.color = color;
    }

    render(p: p5_ | p5_.Graphics): void {
        Sphere.render(p, this.center, this.radius, this.color);
    }

    static render(p: p5_ | p5_.Graphics, center: vector3, radius: number, color: vector3 = [0, 0, 0]): void {
        p.push();
        p.translate(...center);
        p.fill(...color);
        p.noStroke();
        p.sphere(radius, 16, 16);
        p.pop();
    }
}

export class Box implements Renderable {
    center: vector3;
    size: vector3;
    rotation: vector3;
    color: vector3;
    constructor(center: vector3, size: vector3, rotation: vector3 = [0, 0, 0], color: vector3 = [0, 0, 0]) {
        this.center = center;
        this.size = size;
        this.rotation = rotation;
        this.color = color;
    }

    render(p: p5_ | p5_.Graphics): void {
        Box.render(p, this.center, this.size, this.rotation, this.color);
    }

    static render(p: p5_ | p5_.Graphics, center: vector3, size: vector3, rotation: vector3 = [0, 0, 0], color: vector3 = [0, 0, 0]): void {
        p.push();
        p.translate(...center);
        p.rotateX(rotation[0]);
        p.rotateY(rotation[1]);
        p.rotateZ(rotation[2]);
        p.stroke(...color);
        p.noFill();
        p.box(...size);
        p.pop();
    }
}

