import type p5_ from "p5";
import { vector3, cross, scale, normalize, sub, add, mag, dot } from "../../_script/linearalgebra";
import { Renderable, Point, Line, Label } from "./objects"
declare const p5: typeof p5_;

function resetAs2D(p: p5_) {
    p.resetMatrix();
    p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, 0, 1000);
    p.camera(p.width / 2, p.height / 2, 500, p.width / 2, p.height / 2, 0, 0, 1, 0); // Position, LookAt, Up
}

export class IdealCamera {
    eye: vector3;
    target: vector3;

    up: vector3 = [0, -1, 0];
    width: number;
    height: number;
    innerCanvas?: p5_.Graphics;

    eyeLabel: Label;
    targetLabel: Label;
    planeLabel: Label;
    axisLabel: Label;

    constructor(eye: vector3, target: vector3, width: number, height: number, p?: p5_) {
        this.eye = eye;
        this.target = target;
        this.width = width;
        this.height = height;

        this.eyeLabel = new Label(this.eye, "視点 E");
        this.targetLabel = new Label(this.target, "視心 O");

        const forward = normalize(sub(this.target, this.eye));
        const right = normalize(cross(forward, this.up));
        const trueUp = normalize(cross(right, forward));
        const cornerPos = add(add(this.target, scale(right, -width / 2)), scale(trueUp, -height / 2 + 5));

        this.planeLabel = new Label(cornerPos, "投影面", [0, 0, 0], trueUp, right);
        this.axisLabel = new Label(add(scale(trueUp, -14), scale(add(this.eye, this.target), 0.5)), "視軸", [0, 0, 0], trueUp, forward);

        if (p) this.innerCanvas = p.createGraphics(width, height, p.WEBGL);
    }

    solve(point: vector3): vector3 | undefined {
        const dir = normalize(sub(point, this.eye));

        // 素朴な実装
        // const axis = normalize(sub(this.target, this.eye));
        // const distance = mag(sub(this.target, this.eye));
        // const t = distance / dot(axis, dir);

        // 軽量化した実装
        const axis = sub(this.target, this.eye);
        const t = dot(axis, axis) / dot(axis, dir);

        if (t < 0) return undefined; // カメラの後ろにある場合は無視
        return add(this.eye, scale(dir, t));
    }

    solve_virtual(point: vector3): vector3 | undefined {
        const dir = normalize(sub(point, this.eye));

        // 軽量化した実装
        const axis = sub(this.target, this.eye);
        const t = dot(axis, axis) / dot(axis, dir);

        if (t > 0) return undefined; // カメラの前にある場合は無視
        return add(this.eye, scale(dir, t));
    }

    innerSetCamera() {
        if (!this.innerCanvas) return;
        
        this.innerCanvas.camera(...this.eye, ...this.target, ...this.up);
        const distance = mag(sub(this.target, this.eye));
        const fovy = 2 * Math.atan(this.height / 2 / distance);
        this.innerCanvas.perspective(fovy);
    }

    innerRender(objects: Renderable[]) {
        if (!this.innerCanvas) return;

        this.innerSetCamera();

        for (const obj of objects) {
            obj.render(this.innerCanvas);
        }

    }

    canvasRender(p: p5_) {
        if (!this.innerCanvas) return;

        const screenPos = [20, 20] as [number, number];

        p.push();
        resetAs2D(p);
        p.image(this.innerCanvas, ...screenPos);
        p.noFill();
        p.stroke(0, 0, 0);
        p.rect(...screenPos, this.width, this.height);
        p.pop();

        this.innerCanvas.background(255);
    }

    outerRender(p: p5_, options: {
        target?: boolean,
        axis?: boolean,
        axislabel?: boolean
    } = {}) {
        // デフォルト値の設定
        if (options.target === undefined) options.target = true;
        if (options.axis === undefined) options.axis = true;
        if (options.axislabel === undefined) options.axislabel = false;

        // 視点を描画
        Point.render(p, this.eye, [0, 0, 0]);

        if (options.target) {
            // 視心を描画
            Point.render(p, this.target, [0, 0, 0]);
        }

        if (options.axis) {
            // 視軸を描画
            Line.render(p, this.eye, this.target, [0, 0, 0]);
        }

        const right = normalize(cross(this.up, sub(this.target, this.eye)));
        const up = normalize(cross(sub(this.target, this.eye), right));

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // 長方形を描画
        p.push();
        p.translate(...this.target);
        p.stroke(0, 0, 0);
        p.fill(255, 255, 255, 150);
        p.beginShape();
        p.vertex(...add(scale(right, -halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, halfHeight)));
        p.vertex(...add(scale(right, -halfWidth), scale(up, halfHeight)));
        p.endShape(p.CLOSE);
        p.pop();

        this.eyeLabel.render(p);
        if (options.target) {
            this.targetLabel.render(p);
        }
        if (options.axis) {
            this.axisLabel.render(p);
        }
        this.planeLabel.render(p);
    }


    history = new Map<number, [number, vector3, vector3 | undefined, vector3 | undefined][]>();
    historyLifespan = 3000; // ms

    renderTrace(p: p5_, point: vector3, id = 0, options: {
        renderVirtual?: boolean
        renderInner?: boolean
        renderImageLocus?: boolean
        renderPointLocus?: boolean
        renderInnerLocus?: boolean
    } = {}) {
        const pointColor: vector3 = [0, 0, 0];
        const imageColor: vector3 = [255, 0, 0];
        const virtualImageColor: vector3 = [0, 0, 255];

        const renderVirtual = options.renderVirtual ?? false;
        const renderInner = options.renderInner ?? false;
        const renderImageLocus = options.renderImageLocus ?? false;
        const renderPointLocus = options.renderPointLocus ?? false;
        const renderInnerLocus = options.renderInnerLocus ?? false;

        const image = this.solve(point);
        const vImage = this.solve_virtual(point);

        const history = this.history.get(id) || [];
        history.push([p.millis(), point, image, vImage]);
        while (history.length > 0 && p.millis() - history[0][0] > this.historyLifespan) {
            history.shift();
        }
        this.history.set(id, history);

        Point.render(p, point, pointColor);

        if (image) {
            const point_extended = add(point, scale(normalize(sub(point, this.eye)), 10));
            const image_extended = add(image, scale(normalize(sub(image, this.eye)), 10));

            Point.render(p, image, imageColor);

            Line.render(p, this.eye, point_extended, imageColor);
            Line.render(p, this.eye, image_extended, imageColor);
        }

        if (vImage && renderVirtual) {
            const point_extended = add(point, scale(normalize(sub(point, this.eye)), 10));
            const image_extended = add(vImage, scale(normalize(sub(vImage, this.eye)), 10));

            Point.render(p, vImage, virtualImageColor);

            Line.render(p, this.eye, point_extended, virtualImageColor);
            Line.render(p, this.eye, image_extended, virtualImageColor);
        }

        if (renderPointLocus) {
            for (let i = 0; i < history.length - 1; i++) {
                const p1 = history[i][1];
                const p2 = history[i + 1][1];

                const alpha = (i + 1) / history.length;

                p.push();
                p.strokeWeight(alpha)
                Line.render(p, p1, p2, pointColor);
                p.pop();
            }
        }

        if (renderImageLocus) {
            for (let i = 0; i < history.length - 1; i++) {
                const p1 = history[i][2];
                const p2 = history[i + 1][2];

                if (!p1 || !p2) continue;

                const alpha = (i + 1) / history.length;

                p.push();
                p.strokeWeight(alpha)
                Line.render(p, p1, p2, imageColor);
                p.pop();
            }
        }

        if (renderImageLocus && renderVirtual) {
            for (let i = 0; i < history.length - 1; i++) {
                const p1 = history[i][3];
                const p2 = history[i + 1][3];

                if (!p1 || !p2) continue;

                const alpha = (i + 1) / history.length;

                p.push();
                p.strokeWeight(alpha)
                Line.render(p, p1, p2, virtualImageColor);
                p.pop();
            }
        }

        if (this.innerCanvas && renderInner) {
            this.innerSetCamera();

            if (image) Point.render(this.innerCanvas, image, imageColor);

            if (vImage && renderVirtual) Point.render(this.innerCanvas, vImage, virtualImageColor);

            if (renderInnerLocus) {
                for (let i = 0; i < history.length - 1; i++) {
                    const p1 = history[i][2];
                    const p2 = history[i + 1][2];

                    if (!p1 || !p2) continue;

                    const alpha = (i + 1) / history.length;

                    this.innerCanvas.push();
                    this.innerCanvas.strokeWeight(alpha)
                    Line.render(this.innerCanvas, p1, p2, imageColor);
                    this.innerCanvas.pop();
                }
            }

            if (renderInnerLocus && renderVirtual) {
                for (let i = 0; i < history.length - 1; i++) {
                    const p1 = history[i][3];
                    const p2 = history[i + 1][3];

                    if (!p1 || !p2) continue;

                    const alpha = (i + 1) / history.length;

                    this.innerCanvas.push();
                    this.innerCanvas.strokeWeight(alpha)
                    Line.render(this.innerCanvas, p1, p2, virtualImageColor);
                    this.innerCanvas.pop();
                }
            }
        }
    }
}