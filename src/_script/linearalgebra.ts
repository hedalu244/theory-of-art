export type vector3 = [number, number, number];
export type matrix3 = [vector3, vector3, vector3];

export function cross(a: vector3, b: vector3): vector3 {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

export function add(a: vector3, b: vector3): vector3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: vector3, b: vector3): vector3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function dot(a: vector3, b: vector3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function scale(a: vector3, s: number): vector3 {
    return [a[0] * s, a[1] * s, a[2] * s];
}

export function mag(a: vector3): number {
    return Math.sqrt(dot(a, a));
}

export function normalize(a: vector3): vector3{
    const length = mag(a);
    if (length === 0) throw new Error("Cannot normalize a zero-length vector.");
    return scale(a, 1 / length);
}

export function applyMatrix3(v: vector3, m: matrix3): vector3 {
    return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
    ];
}
export function determinant(m: matrix3): number {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
        - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}
// 余因子行列を用いた逆行列
export function inverseMatrix3(m: matrix3): matrix3 {
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