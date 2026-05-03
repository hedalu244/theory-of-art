import type p5_ from "p5";
import { vector3, cross, scale, normalize, sub, add, mag, dot } from "../../_script/linearalgebra";
import { Renderable, Point, Segment, Label, Shape } from "./objects"
import { toP5Color } from "../../_script/color";
declare const p5: typeof p5_;

export function resetAs2D(p: p5_) {
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

    constructor(eye: vector3, target: vector3, width: number, height: number, p?: p5_) {
        this.eye = eye;
        this.target = target;
        this.width = width;
        this.height = height;

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
        this.innerCanvas.perspective(fovy, this.width / this.height, 0.1, 1000);
    }

    innerRender(objects: Renderable[]) {
        if (!this.innerCanvas) return;

        this.innerSetCamera();

        for (const obj of objects) {
            obj.render(this.innerCanvas);
        }
    }

    renderImage(p: p5_, object: Shape) {
        const vertices = object.vertices;
        const image = vertices.map(v => this.solve(v));
        // .filter((v): v is vector3 => v !== undefined);
        let fragment = [] as vector3[];
        for (let i = 0; i < vertices.length; i++) {
            if (image[i] && isFinite(image[i]![0]) && isFinite(image[i]![1]) && isFinite(image[i]![2])) {
                fragment.push(image[i]!);
            } else if (fragment.length > 0) {
                Shape.renderShape(p, fragment, object.strokeColor, object.fillColor);
                fragment = [];
            }
        }
        if (fragment.length > 0) Shape.renderShape(p, fragment, object.strokeColor, object.fillColor);
    }
    canvasRender(p: p5_) {
        if (!this.innerCanvas) return;

        const screenPos = [20, 20] as [number, number];

        p.push();
        resetAs2D(p);
        p.image(this.innerCanvas, ...screenPos);
        p.noFill();
        p.stroke("#000");
        p.rect(...screenPos, this.width, this.height);
        p.pop();

        this.innerCanvas.background(255);
    }
    outerRender(p: p5_, options: {
        target?: boolean,
        axis?: boolean,
        critical?: boolean,
        axislabel?: boolean
    } = {}) {
        // デフォルト値の設定
        if (options.target === undefined) options.target = false;
        if (options.axis === undefined) options.axis = false;
        if (options.critical === undefined) options.critical = false;
        if (options.axislabel === undefined) options.axislabel = false;

        // 視点を描画
        Point.render(p, this.eye, "#000");

        if (options.target) {
            // 視心を描画
            Point.render(p, this.target, "#000");
        }

        if (options.axis) {
            // 視軸を描画
            Segment.renderSegment(p, this.eye, this.target, "#000");
        }

        const forward = normalize(sub(this.target, this.eye));
        const right = normalize(cross(this.up, forward));
        const up = normalize(cross(right, forward));

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // 長方形を描画
        p.push();
        p.translate(...this.target);
        p.stroke("#000");
        // p.fill(255, 255, 255, 150); 半透明厳しい
        p.noFill();
        p.beginShape();
        p.vertex(...add(scale(right, -halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, halfHeight)));
        p.vertex(...add(scale(right, -halfWidth), scale(up, halfHeight)));
        p.endShape(p.CLOSE);
        p.pop();

        // 臨界面
        if (options.critical) {
            p.push();
            p.translate(...this.eye);
            p.stroke("#f00");
            // p.fill(255, 255, 255, 150); 半透明厳しい
            p.noFill();
            p.beginShape();
            p.vertex(...add(scale(right, -halfWidth), scale(up, -halfHeight)));
            p.vertex(...add(scale(right, halfWidth), scale(up, -halfHeight)));
            p.vertex(...add(scale(right, halfWidth), scale(up, halfHeight)));
            p.vertex(...add(scale(right, -halfWidth), scale(up, halfHeight)));
            p.endShape(p.CLOSE);
            p.pop();
        }


        //const forward = normalize(sub(this.target, this.eye));
        //const right = normalize(cross(forward, this.up));
        //const up = normalize(cross(right, forward));
        const planeLabelPos = add(add(this.target, scale(right, halfWidth)), scale(up, halfHeight - 5));
        const criticalLabelPos = add(add(this.eye, scale(right, halfWidth)), scale(up, halfHeight - 5));

        Label.renderLabel(p, this.eye, "視点 E");
        if (options.target) {
            Label.renderLabel(p, this.target, "視心 O");
        }
        if (options.axis) {
            Label.renderLabel(p, add(scale(up, -14), scale(add(this.eye, this.target), 0.5)), "視軸", "#000", up, forward);
        }
        Label.renderLabel(p, planeLabelPos, "投影面", "#000", up, scale(right, -1));
        if (options.critical) {
            Label.renderLabel(p, criticalLabelPos, "臨界面", "#f00", up, scale(right, -1));
        }
    }


    history = new Map<number, [number, vector3, vector3 | undefined, vector3 | undefined][]>();
    historyLifespan = 1000; // ms

    renderTrace(p: p5_, point: vector3, id = 0, 
    pointColor = "#000",
    imageColor = "#f00",
    virtualImageColor?: string,    
    options: {
        renderInner?: boolean
        renderImageLocus?: boolean
        renderPointLocus?: boolean
        renderInnerLocus?: boolean
        extension?: number
    } = {}) {
        const renderInner = options.renderInner ?? false;
        const renderImageLocus = options.renderImageLocus ?? false;
        const renderPointLocus = options.renderPointLocus ?? false;
        const renderInnerLocus = options.renderInnerLocus ?? false;
        const extension = options.extension ?? 50;

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
            const point_extended = add(point, scale(normalize(sub(point, this.eye)), extension));
            const image_extended = add(image, scale(normalize(sub(image, this.eye)), extension));

            Point.render(p, image, imageColor);

            Segment.renderSegment(p, this.eye, point_extended, imageColor);
            Segment.renderSegment(p, this.eye, image_extended, imageColor);
        }

        if (vImage && virtualImageColor) {
            const point_extended = add(point, scale(normalize(sub(point, this.eye)), extension));
            const image_extended = add(vImage, scale(normalize(sub(vImage, this.eye)), extension));

            Point.render(p, vImage, virtualImageColor);

            Segment.renderSegment(p, this.eye, point_extended, virtualImageColor);
            Segment.renderSegment(p, this.eye, image_extended, virtualImageColor);
        }

        if (renderPointLocus) {
            for (let i = 0; i < history.length - 1; i++) {
                const p1 = history[i][1];
                const p2 = history[i + 1][1];

                const alpha = (i + 1) / history.length;

                p.push();
                p.strokeWeight(alpha)
                Segment.renderSegment(p, p1, p2, pointColor);
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
                Segment.renderSegment(p, p1, p2, imageColor);
                p.pop();
            }
        }

        if (renderImageLocus && virtualImageColor) {
            for (let i = 0; i < history.length - 1; i++) {
                const p1 = history[i][3];
                const p2 = history[i + 1][3];

                if (!p1 || !p2) continue;

                const alpha = (i + 1) / history.length;

                p.push();
                p.strokeWeight(alpha)
                Segment.renderSegment(p, p1, p2, virtualImageColor);
                p.pop();
            }
        }

        if (this.innerCanvas && renderInner) {
            this.innerSetCamera();

            if (image) Point.render(this.innerCanvas, image, imageColor);

            if (vImage && virtualImageColor) Point.render(this.innerCanvas, vImage, virtualImageColor);

            if (renderInnerLocus) {
                for (let i = 0; i < history.length - 1; i++) {
                    const p1 = history[i][2];
                    const p2 = history[i + 1][2];

                    if (!p1 || !p2) continue;

                    const alpha = (i + 1) / history.length;

                    this.innerCanvas.push();
                    this.innerCanvas.strokeWeight(alpha)
                    Segment.renderSegment(this.innerCanvas, p1, p2, imageColor);
                    this.innerCanvas.pop();
                }
            }

            if (renderInnerLocus && virtualImageColor) {
                for (let i = 0; i < history.length - 1; i++) {
                    const p1 = history[i][3];
                    const p2 = history[i + 1][3];

                    if (!p1 || !p2) continue;

                    const alpha = (i + 1) / history.length;

                    this.innerCanvas.push();
                    this.innerCanvas.strokeWeight(alpha)
                    Segment.renderSegment(this.innerCanvas, p1, p2, virtualImageColor);
                    this.innerCanvas.pop();
                }
            }
        }
    }
}