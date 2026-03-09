type vector3 = [number, number, number];
type matrix3 = [vector3, vector3, vector3];

function applyMatrix3(v: vector3, m: matrix3): vector3 {
    return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
    ];
}
function determinant(m: matrix3): number {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
        - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}
// 余因子行列を用いた逆行列
function inverseMatrix3(m: matrix3): matrix3 {
    const det = determinant(m);
    if (det === 0) throw new Error("Matrix is singular and cannot be inverted.");
    const invDet = 1 / det;
    return [
        [
            (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
            (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
            (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet
        ], [
            (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
            (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
            (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet
        ], [
            (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
            (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
            (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet]
        ,
    ];
}

export interface sRGBColor { mode: "sRGB"; data: vector3 } // 0 ~ 255
export interface RGBColor { mode: "RGB"; data: vector3 } // 0 ~ 1
export interface XYZColor { mode: "XYZ"; data: vector3 }
export interface LMSColor { mode: "LMS"; data: vector3 }
export interface LABColor { mode: "LAB"; data: vector3 }

export type Color = sRGBColor | RGBColor | XYZColor | LMSColor | LABColor;

export function RGBColor(r: number, g: number, b: number): RGBColor {
    return { mode: "RGB", data: [r, g, b] };
}
export function sRGBColor(r: number, g: number, b: number): sRGBColor {
    return { mode: "sRGB", data: [r, g, b] };
}
export function XYZColor(x: number, y: number, z: number): XYZColor {
    return { mode: "XYZ", data: [x, y, z] };
}
export function LMSColor(l: number, m: number, s: number): LMSColor {
    return { mode: "LMS", data: [l, m, s] };
}
export function LABColor(l: number, a: number, b: number): LABColor {
    return { mode: "LAB", data: [l, a, b] };
}

function RGBtosRGB(color: RGBColor): sRGBColor {
    // ガンマ補正
    const data = color.data;
    const r = Math.max(0, Math.min(1, data[0]));
    const g = Math.max(0, Math.min(1, data[1]));
    const b = Math.max(0, Math.min(1, data[2]));
    return sRGBColor(
        (r <= 0.0031308 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055) * 255,
        (g <= 0.0031308 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055) * 255,
        (b <= 0.0031308 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055) * 255,
    );
}

function sRGBtoRGB(color: sRGBColor): RGBColor {
    // ガンマ補正の逆変換
    const data = color.data;
    const r = Math.max(0, Math.min(255, data[0])) / 255;
    const g = Math.max(0, Math.min(255, data[1])) / 255;
    const b = Math.max(0, Math.min(255, data[2])) / 255;
    return RGBColor(
        r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
        g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
        b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4),
    );
}

const m_RGBtoXYZ: matrix3 = [
    [0.412391, 0.357584, 0.180481],
    [0.212639, 0.715169, 0.072192],
    [0.019331, 0.119195, 0.950532],
];
const m_XYZtoRGB = inverseMatrix3(m_RGBtoXYZ);

function RGBtoXYZ(color: RGBColor): XYZColor { return XYZColor(...applyMatrix3(color.data, m_RGBtoXYZ)); }
function XYZtoRGB(color: XYZColor): RGBColor { return RGBColor(...applyMatrix3(color.data, m_XYZtoRGB)); }

const m_XYZtoLMS: matrix3 = [
    [0.4002, 0.7076, -0.0808],
    [-0.2263, 1.1653, 0.0457],
    [0, 0, 0.9182],
];
const m_LMStoXYZ = inverseMatrix3(m_XYZtoLMS);

function XYZtoLMS(color: XYZColor): LMSColor { return LMSColor(...applyMatrix3(color.data, m_XYZtoLMS)); }
function LMStoXYZ(color: LMSColor): XYZColor { return XYZColor(...applyMatrix3(color.data, m_LMStoXYZ)); }

const m_LMStoLAB: matrix3 = [
    [0.4122214708, 0.2126728521, 0.0193339084],
    [0.2126728521, 0.7151521553, 0.1191920259],
    [0.0193339084, 0.1191920259, 0.9504559271],
];
const m_LABtoLMS = inverseMatrix3(m_LMStoLAB);

function LMStoLAB(color: LMSColor): LABColor { return LABColor(...applyMatrix3(color.data, m_LMStoLAB)); }
function LABtoLMS(color: LABColor): LMSColor { return LMSColor(...applyMatrix3(color.data, m_LABtoLMS)); }

export function toSRGB(color: Color): sRGBColor {
    switch (color.mode) {
        case "sRGB": return color;
        case "RGB": return RGBtosRGB(color);
        case "XYZ": return RGBtosRGB(XYZtoRGB(color));
        case "LMS": return RGBtosRGB(XYZtoRGB(LMStoXYZ(color)));
        case "LAB": return RGBtosRGB(XYZtoRGB(LMStoXYZ(LABtoLMS(color))));
    }
}
export function toRGB(color: Color): RGBColor {
    switch (color.mode) {
        case "sRGB": return sRGBtoRGB(color);
        case "RGB": return color;
        case "XYZ": return XYZtoRGB(color);
        case "LMS": return XYZtoRGB(LMStoXYZ(color));
        case "LAB": return XYZtoRGB(LMStoXYZ(LABtoLMS(color)));
    }
}
export function toXYZ(color: Color): XYZColor {
    switch (color.mode) {
        case "sRGB": return RGBtoXYZ(sRGBtoRGB(color));
        case "RGB": return RGBtoXYZ(color);
        case "XYZ": return color;
        case "LMS": return LMStoXYZ(color);
        case "LAB": return LMStoXYZ(LABtoLMS(color));
    }
}
export function toLMS(color: Color): LMSColor {
    switch (color.mode) {
        case "sRGB": return XYZtoLMS(RGBtoXYZ(sRGBtoRGB(color)));
        case "RGB": return XYZtoLMS(RGBtoXYZ(color));
        case "XYZ": return XYZtoLMS(color);
        case "LMS": return color;
        case "LAB": return LABtoLMS(color);
    }
}
export function toLAB(color: Color): LABColor {
    switch (color.mode) {
        case "sRGB": return LMStoLAB(XYZtoLMS(RGBtoXYZ(sRGBtoRGB(color))));
        case "RGB": return LMStoLAB(XYZtoLMS(RGBtoXYZ(color)));
        case "XYZ": return LMStoLAB(XYZtoLMS(color));
        case "LMS": return LMStoLAB(color);
        case "LAB": return color;
    }
}

import type p5_ from "p5";
export function toP5Color(p: p5_, color: Color): p5_.Color {
    const srgb = toSRGB(color);
    p.colorMode(p.RGB, 255);
    return p.color(srgb.data[0], srgb.data[1], srgb.data[2]);
}

export function isInGamut(color: Color): boolean {
    //return true; // とりあえず全ての色をガマット内とする

    const xyz = toXYZ(color).data;
    const sum = xyz[0] + xyz[1] + xyz[2];
    if (sum === 0) return true;
    const P = xyz.map(v => v / sum);

    // 内外判定
    let count = 0
    for (let i = 0; i < monochromaticityData.length; i++) {
        const Q = monochromaticityData[i].color.data;
        const R = monochromaticityData[(i + 1) % monochromaticityData.length].color.data;

        if (Q[0] < P[0] && P[0] <= R[0] || R[0] < P[0] && P[0] <= Q[0]) {
            const intersectionY = Q[1] + (R[1] - Q[1]) * (P[0] - Q[0]) / (R[0] - Q[0]);
            if (P[1] < intersectionY) count++;
        }
    }
    return count % 2 === 1; // 奇数なら内側、偶数なら外側
}

export function colorLerp<T extends Color>(c1: T, c2: T, t: number): T {
    if (c1.mode !== c2.mode) throw new Error("Color modes must match for interpolation.");
    return {
        mode: c1.mode, data: [
            c1.data[0] + t * (c2.data[0] - c1.data[0]),
            c1.data[1] + t * (c2.data[1] - c1.data[1]),
            c1.data[2] + t * (c2.data[2] - c1.data[2])
        ]
    } as T;
}

export function colorGain<T extends Color>(color: T, gain: number): T {
    if (color.mode === "sRGB")
        console.warn("Scaling sRGB colors directly may produce unexpected results.");
    return {
        mode: color.mode, data: [
            color.data[0] * gain,
            color.data[1] * gain,
            color.data[2] * gain
        ]
    } as T;
}

export function colorAdd<T extends Color>(c1: T, c2: T): T {
    if (c1.mode !== c2.mode) throw new Error("Color modes must match for addition.");
    if (c1.mode === "sRGB")
        console.warn("Adding sRGB colors directly may produce unexpected results.");

    return {
        mode: c1.mode, data: [
            c1.data[0] + c2.data[0],
            c1.data[1] + c2.data[1],
            c1.data[2] + c2.data[2]
        ]
    } as T;
}

export function monochromaticity(wavelength: number): XYZColor {
    let l = 0;
    let r = monochromaticityData.length - 1
    if (wavelength < monochromaticityData[l].wavelength) return XYZColor(0, 0, 0);
    if (wavelength > monochromaticityData[r].wavelength) return XYZColor(0, 0, 0);

    // 二分探索
    while (l + 1 < r) {
        const m = Math.floor((l + r) / 2);
        if (monochromaticityData[m].wavelength < wavelength) l = m;
        else r = m;
    }

    const L = monochromaticityData[l];
    const R = monochromaticityData[r];
    return colorLerp(
        L.color, R.color,
        (wavelength - L.wavelength) / (R.wavelength - L.wavelength));
}

export const monochromaticityData: { wavelength: number; color: XYZColor }[] = [
    { wavelength: 360, color: XYZColor(0.17556, 0.00529, 0.81915) },
    { wavelength: 365, color: XYZColor(0.17516, 0.00526, 0.81958) },
    { wavelength: 370, color: XYZColor(0.17482, 0.00522, 0.81996) },
    { wavelength: 375, color: XYZColor(0.17451, 0.00518, 0.82031) },
    { wavelength: 380, color: XYZColor(0.17411, 0.00496, 0.82093) },
    { wavelength: 385, color: XYZColor(0.17401, 0.00498, 0.82101) },
    { wavelength: 390, color: XYZColor(0.1738, 0.00492, 0.82128) },
    { wavelength: 395, color: XYZColor(0.17356, 0.00492, 0.82152) },
    { wavelength: 400, color: XYZColor(0.17334, 0.0048, 0.82186) },
    { wavelength: 405, color: XYZColor(0.17302, 0.00478, 0.8222) },
    { wavelength: 410, color: XYZColor(0.17258, 0.0048, 0.82262) },
    { wavelength: 415, color: XYZColor(0.17209, 0.00483, 0.82308) },
    { wavelength: 420, color: XYZColor(0.17141, 0.0051, 0.82349) },
    { wavelength: 425, color: XYZColor(0.1703, 0.00579, 0.82391) },
    { wavelength: 430, color: XYZColor(0.16888, 0.0069, 0.82422) },
    { wavelength: 435, color: XYZColor(0.1669, 0.00855, 0.82455) },
    { wavelength: 440, color: XYZColor(0.16441, 0.01086, 0.82473) },
    { wavelength: 445, color: XYZColor(0.16111, 0.01379, 0.8251) },
    { wavelength: 450, color: XYZColor(0.15664, 0.01771, 0.82565) },
    { wavelength: 455, color: XYZColor(0.15099, 0.02274, 0.82627) },
    { wavelength: 460, color: XYZColor(0.14396, 0.0297, 0.82634) },
    { wavelength: 465, color: XYZColor(0.1355, 0.03988, 0.82462) },
    { wavelength: 470, color: XYZColor(0.12412, 0.0578, 0.81808) },
    { wavelength: 475, color: XYZColor(0.1096, 0.08684, 0.80356) },
    { wavelength: 480, color: XYZColor(0.09129, 0.1327, 0.77601) },
    { wavelength: 485, color: XYZColor(0.06871, 0.20072, 0.73057) },
    { wavelength: 490, color: XYZColor(0.04539, 0.29498, 0.65963) },
    { wavelength: 495, color: XYZColor(0.02346, 0.4127, 0.56384) },
    { wavelength: 500, color: XYZColor(0.00817, 0.53842, 0.45341) },
    { wavelength: 505, color: XYZColor(0.00386, 0.65482, 0.34132) },
    { wavelength: 510, color: XYZColor(0.01387, 0.75019, 0.23594) },
    { wavelength: 515, color: XYZColor(0.03885, 0.81202, 0.14913) },
    { wavelength: 520, color: XYZColor(0.0743, 0.8338, 0.0919) },
    { wavelength: 525, color: XYZColor(0.11416, 0.82621, 0.05963) },
    { wavelength: 530, color: XYZColor(0.15472, 0.80586, 0.03942) },
    { wavelength: 535, color: XYZColor(0.19288, 0.78163, 0.02549) },
    { wavelength: 540, color: XYZColor(0.22962, 0.75433, 0.01605) },
    { wavelength: 545, color: XYZColor(0.26578, 0.72432, 0.0099) },
    { wavelength: 550, color: XYZColor(0.3016, 0.69231, 0.00609) },
    { wavelength: 555, color: XYZColor(0.33736, 0.65885, 0.00379) },
    { wavelength: 560, color: XYZColor(0.3731, 0.62445, 0.00245) },
    { wavelength: 565, color: XYZColor(0.40873, 0.58961, 0.00166) },
    { wavelength: 570, color: XYZColor(0.44406, 0.55472, 0.00122) },
    { wavelength: 575, color: XYZColor(0.47878, 0.5202, 0.00102) },
    { wavelength: 580, color: XYZColor(0.51249, 0.48659, 0.00092) },
    { wavelength: 585, color: XYZColor(0.54479, 0.45443, 0.00078) },
    { wavelength: 590, color: XYZColor(0.57515, 0.42423, 0.00062) },
    { wavelength: 595, color: XYZColor(0.60293, 0.3965, 0.00057) },
    { wavelength: 600, color: XYZColor(0.62704, 0.37249, 0.00047) },
    { wavelength: 605, color: XYZColor(0.64823, 0.3514, 0.00037) },
    { wavelength: 610, color: XYZColor(0.66576, 0.33401, 0.00023) },
    { wavelength: 615, color: XYZColor(0.68008, 0.31975, 0.00017) },
    { wavelength: 620, color: XYZColor(0.69151, 0.30834, 0.00015) },
    { wavelength: 625, color: XYZColor(0.70061, 0.2993, 0.00009) },
    { wavelength: 630, color: XYZColor(0.70792, 0.29203, 0.00005) },
    { wavelength: 635, color: XYZColor(0.71403, 0.28593, 0.00004) },
    { wavelength: 640, color: XYZColor(0.71903, 0.28094, 0.00003) },
    { wavelength: 645, color: XYZColor(0.72303, 0.27695, 0.00002) },
    { wavelength: 646, color: XYZColor(0.7237, 0.27628, 0.00002) },
    { wavelength: 650, color: XYZColor(0.72599, 0.27401, 0) },
    { wavelength: 655, color: XYZColor(0.72827, 0.27173, 0) },
    { wavelength: 660, color: XYZColor(0.72997, 0.27003, 0) },
    { wavelength: 665, color: XYZColor(0.73109, 0.26891, 0) },
    { wavelength: 670, color: XYZColor(0.73199, 0.26801, 0) },
    { wavelength: 675, color: XYZColor(0.73272, 0.26728, 0) },
    { wavelength: 680, color: XYZColor(0.73342, 0.26658, 0) },
    { wavelength: 685, color: XYZColor(0.73405, 0.26595, 0) },
    { wavelength: 690, color: XYZColor(0.73439, 0.26561, 0) },
    { wavelength: 695, color: XYZColor(0.73459, 0.26541, 0) },
    { wavelength: 700, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 705, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 710, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 715, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 720, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 725, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 730, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 735, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 740, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 745, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 750, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 755, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 760, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 765, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 770, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 775, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 780, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 785, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 790, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 795, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 800, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 805, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 810, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 815, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 820, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 825, color: XYZColor(0.73469, 0.26531, 0) },
    { wavelength: 830, color: XYZColor(0.73469, 0.26531, 0) }
];

