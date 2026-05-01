var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/_script/sketch-helper.ts
function normalizeSketch(el, rawControl) {
  if (!rawControl || typeof rawControl !== "object")
    rawControl = {};
  const candidate = rawControl;
  return {
    el,
    start: typeof candidate.start === "function" ? candidate.start : () => {
    },
    stop: typeof candidate.stop === "function" ? candidate.stop : () => {
    },
    destroy: typeof candidate.destroy === "function" ? candidate.destroy : () => {
    }
  };
}
function createP5Sketch(el, sketch) {
  const instance = new p5(sketch, el);
  let running = true;
  return {
    el,
    start: () => {
      instance.loop();
      running = true;
    },
    stop: () => {
      instance.noLoop();
      running = false;
    },
    destroy: () => {
      instance.remove();
      running = false;
    }
  };
}
var init_sketch_helper = __esm({
  "src/_script/sketch-helper.ts"() {
    "use strict";
  }
});

// src/_script/sketches/test-sketch.sketch.ts
var test_sketch_sketch_exports = {};
__export(test_sketch_sketch_exports, {
  create: () => create
});
function create(el, option) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "90";
  input.value = "45";
  el.appendChild(input);
  el.appendChild(document.createElement("br"));
  return createP5Sketch(el, (p) => {
    p.setup = () => {
      p.createCanvas(400, 300, p.WEBGL);
    };
    p.draw = () => {
      p.background(230);
      p.rotateY(input.valueAsNumber * p.PI / 180);
      p.box(100);
      console.log("rendered", option.id);
    };
  });
}
var init_test_sketch_sketch = __esm({
  "src/_script/sketches/test-sketch.sketch.ts"() {
    "use strict";
    init_sketch_helper();
  }
});

// src/_script/linearalgebra.ts
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function scale(a, s) {
  return [a[0] * s, a[1] * s, a[2] * s];
}
function mag(a) {
  return Math.sqrt(dot(a, a));
}
function normalize(a) {
  const length = mag(a);
  if (length === 0) throw new Error("Cannot normalize a zero-length vector.");
  return scale(a, 1 / length);
}
function applyMatrix3(v, m) {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]
  ];
}
function determinant(m) {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}
function inverseMatrix3(m) {
  const det = determinant(m);
  if (det === 0) throw new Error("Matrix is singular and cannot be inverted.");
  const invDet = 1 / det;
  return [
    [
      (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
      (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
      (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet
    ],
    [
      (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
      (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
      (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet
    ],
    [
      (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
      (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
      (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet
    ]
  ];
}
var init_linearalgebra = __esm({
  "src/_script/linearalgebra.ts"() {
    "use strict";
  }
});

// src/_script/color.ts
function RGBColor(r, g, b) {
  return { mode: "RGB", data: [r, g, b] };
}
function sRGBColor(r, g, b) {
  return { mode: "sRGB", data: [r, g, b] };
}
function XYZColor(x, y, z) {
  return { mode: "XYZ", data: [x, y, z] };
}
function LMSColor(l, m, s) {
  return { mode: "LMS", data: [l, m, s] };
}
function RGBtosRGB(color) {
  const data = color.data;
  const r = Math.max(0, Math.min(1, data[0]));
  const g = Math.max(0, Math.min(1, data[1]));
  const b = Math.max(0, Math.min(1, data[2]));
  return sRGBColor(
    (r <= 31308e-7 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055) * 255,
    (g <= 31308e-7 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055) * 255,
    (b <= 31308e-7 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055) * 255
  );
}
function sRGBtoRGB(color) {
  const data = color.data;
  const r = Math.max(0, Math.min(255, data[0])) / 255;
  const g = Math.max(0, Math.min(255, data[1])) / 255;
  const b = Math.max(0, Math.min(255, data[2])) / 255;
  return RGBColor(
    r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  );
}
function RGBtoXYZ(color) {
  return XYZColor(...applyMatrix3(color.data, m_RGBtoXYZ));
}
function XYZtoRGB(color) {
  return RGBColor(...applyMatrix3(color.data, m_XYZtoRGB));
}
function XYZtoLMS(color) {
  return LMSColor(...applyMatrix3(color.data, m_XYZtoLMS));
}
function LMStoXYZ(color) {
  return XYZColor(...applyMatrix3(color.data, m_LMStoXYZ));
}
function LABtoLMS(color) {
  return LMSColor(...applyMatrix3(color.data, m_LABtoLMS));
}
function toSRGB(color) {
  switch (color.mode) {
    case "sRGB":
      return color;
    case "RGB":
      return RGBtosRGB(color);
    case "XYZ":
      return RGBtosRGB(XYZtoRGB(color));
    case "LMS":
      return RGBtosRGB(XYZtoRGB(LMStoXYZ(color)));
    case "LAB":
      return RGBtosRGB(XYZtoRGB(LMStoXYZ(LABtoLMS(color))));
  }
}
function toRGB(color) {
  switch (color.mode) {
    case "sRGB":
      return sRGBtoRGB(color);
    case "RGB":
      return color;
    case "XYZ":
      return XYZtoRGB(color);
    case "LMS":
      return XYZtoRGB(LMStoXYZ(color));
    case "LAB":
      return XYZtoRGB(LMStoXYZ(LABtoLMS(color)));
  }
}
function toXYZ(color) {
  switch (color.mode) {
    case "sRGB":
      return RGBtoXYZ(sRGBtoRGB(color));
    case "RGB":
      return RGBtoXYZ(color);
    case "XYZ":
      return color;
    case "LMS":
      return LMStoXYZ(color);
    case "LAB":
      return LMStoXYZ(LABtoLMS(color));
  }
}
function toLMS(color) {
  switch (color.mode) {
    case "sRGB":
      return XYZtoLMS(RGBtoXYZ(sRGBtoRGB(color)));
    case "RGB":
      return XYZtoLMS(RGBtoXYZ(color));
    case "XYZ":
      return XYZtoLMS(color);
    case "LMS":
      return color;
    case "LAB":
      return LABtoLMS(color);
  }
}
function toP5Color(p, color) {
  const srgb = toSRGB(color);
  p.colorMode(p.RGB, 255);
  return p.color(srgb.data[0], srgb.data[1], srgb.data[2]);
}
function isInGamut(color) {
  const xyz = toXYZ(color).data;
  const sum = xyz[0] + xyz[1] + xyz[2];
  if (sum === 0) return true;
  const P = xyz.map((v) => v / sum);
  let count = 0;
  for (let i = 0; i < monochromaticityData.length; i++) {
    const Q = monochromaticityData[i].color.data;
    const R = monochromaticityData[(i + 1) % monochromaticityData.length].color.data;
    if (Q[0] < P[0] && P[0] <= R[0] || R[0] < P[0] && P[0] <= Q[0]) {
      const intersectionY = Q[1] + (R[1] - Q[1]) * (P[0] - Q[0]) / (R[0] - Q[0]);
      if (P[1] < intersectionY) count++;
    }
  }
  return count % 2 === 1;
}
function colorLerp(c1, c2, t) {
  if (c1.mode !== c2.mode) throw new Error("Color modes must match for interpolation.");
  return {
    mode: c1.mode,
    data: [
      c1.data[0] + t * (c2.data[0] - c1.data[0]),
      c1.data[1] + t * (c2.data[1] - c1.data[1]),
      c1.data[2] + t * (c2.data[2] - c1.data[2])
    ]
  };
}
function colorGain(color, gain) {
  if (color.mode === "sRGB")
    console.warn("Scaling sRGB colors directly may produce unexpected results.");
  return {
    mode: color.mode,
    data: [
      color.data[0] * gain,
      color.data[1] * gain,
      color.data[2] * gain
    ]
  };
}
function colorAdd(c1, c2) {
  if (c1.mode !== c2.mode) throw new Error("Color modes must match for addition.");
  if (c1.mode === "sRGB")
    console.warn("Adding sRGB colors directly may produce unexpected results.");
  return {
    mode: c1.mode,
    data: [
      c1.data[0] + c2.data[0],
      c1.data[1] + c2.data[1],
      c1.data[2] + c2.data[2]
    ]
  };
}
function monochromaticity(wavelength) {
  let l = 0;
  let r = monochromaticityData.length - 1;
  if (wavelength < monochromaticityData[l].wavelength) return XYZColor(0, 0, 0);
  if (wavelength > monochromaticityData[r].wavelength) return XYZColor(0, 0, 0);
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    if (monochromaticityData[m].wavelength < wavelength) l = m;
    else r = m;
  }
  const L = monochromaticityData[l];
  const R = monochromaticityData[r];
  return colorLerp(
    L.color,
    R.color,
    (wavelength - L.wavelength) / (R.wavelength - L.wavelength)
  );
}
var m_RGBtoXYZ, m_XYZtoRGB, m_XYZtoLMS, m_LMStoXYZ, m_LMStoLAB, m_LABtoLMS, monochromaticityData;
var init_color = __esm({
  "src/_script/color.ts"() {
    "use strict";
    init_linearalgebra();
    m_RGBtoXYZ = [
      [0.412391, 0.357584, 0.180481],
      [0.212639, 0.715169, 0.072192],
      [0.019331, 0.119195, 0.950532]
    ];
    m_XYZtoRGB = inverseMatrix3(m_RGBtoXYZ);
    m_XYZtoLMS = [
      [0.4002, 0.7076, -0.0808],
      [-0.2263, 1.1653, 0.0457],
      [0, 0, 0.9182]
    ];
    m_LMStoXYZ = inverseMatrix3(m_XYZtoLMS);
    m_LMStoLAB = [
      [0.4122214708, 0.2126728521, 0.0193339084],
      [0.2126728521, 0.7151521553, 0.1191920259],
      [0.0193339084, 0.1191920259, 0.9504559271]
    ];
    m_LABtoLMS = inverseMatrix3(m_LMStoLAB);
    monochromaticityData = [
      { wavelength: 360, color: XYZColor(0.17556, 529e-5, 0.81915) },
      { wavelength: 365, color: XYZColor(0.17516, 526e-5, 0.81958) },
      { wavelength: 370, color: XYZColor(0.17482, 522e-5, 0.81996) },
      { wavelength: 375, color: XYZColor(0.17451, 518e-5, 0.82031) },
      { wavelength: 380, color: XYZColor(0.17411, 496e-5, 0.82093) },
      { wavelength: 385, color: XYZColor(0.17401, 498e-5, 0.82101) },
      { wavelength: 390, color: XYZColor(0.1738, 492e-5, 0.82128) },
      { wavelength: 395, color: XYZColor(0.17356, 492e-5, 0.82152) },
      { wavelength: 400, color: XYZColor(0.17334, 48e-4, 0.82186) },
      { wavelength: 405, color: XYZColor(0.17302, 478e-5, 0.8222) },
      { wavelength: 410, color: XYZColor(0.17258, 48e-4, 0.82262) },
      { wavelength: 415, color: XYZColor(0.17209, 483e-5, 0.82308) },
      { wavelength: 420, color: XYZColor(0.17141, 51e-4, 0.82349) },
      { wavelength: 425, color: XYZColor(0.1703, 579e-5, 0.82391) },
      { wavelength: 430, color: XYZColor(0.16888, 69e-4, 0.82422) },
      { wavelength: 435, color: XYZColor(0.1669, 855e-5, 0.82455) },
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
      { wavelength: 500, color: XYZColor(817e-5, 0.53842, 0.45341) },
      { wavelength: 505, color: XYZColor(386e-5, 0.65482, 0.34132) },
      { wavelength: 510, color: XYZColor(0.01387, 0.75019, 0.23594) },
      { wavelength: 515, color: XYZColor(0.03885, 0.81202, 0.14913) },
      { wavelength: 520, color: XYZColor(0.0743, 0.8338, 0.0919) },
      { wavelength: 525, color: XYZColor(0.11416, 0.82621, 0.05963) },
      { wavelength: 530, color: XYZColor(0.15472, 0.80586, 0.03942) },
      { wavelength: 535, color: XYZColor(0.19288, 0.78163, 0.02549) },
      { wavelength: 540, color: XYZColor(0.22962, 0.75433, 0.01605) },
      { wavelength: 545, color: XYZColor(0.26578, 0.72432, 99e-4) },
      { wavelength: 550, color: XYZColor(0.3016, 0.69231, 609e-5) },
      { wavelength: 555, color: XYZColor(0.33736, 0.65885, 379e-5) },
      { wavelength: 560, color: XYZColor(0.3731, 0.62445, 245e-5) },
      { wavelength: 565, color: XYZColor(0.40873, 0.58961, 166e-5) },
      { wavelength: 570, color: XYZColor(0.44406, 0.55472, 122e-5) },
      { wavelength: 575, color: XYZColor(0.47878, 0.5202, 102e-5) },
      { wavelength: 580, color: XYZColor(0.51249, 0.48659, 92e-5) },
      { wavelength: 585, color: XYZColor(0.54479, 0.45443, 78e-5) },
      { wavelength: 590, color: XYZColor(0.57515, 0.42423, 62e-5) },
      { wavelength: 595, color: XYZColor(0.60293, 0.3965, 57e-5) },
      { wavelength: 600, color: XYZColor(0.62704, 0.37249, 47e-5) },
      { wavelength: 605, color: XYZColor(0.64823, 0.3514, 37e-5) },
      { wavelength: 610, color: XYZColor(0.66576, 0.33401, 23e-5) },
      { wavelength: 615, color: XYZColor(0.68008, 0.31975, 17e-5) },
      { wavelength: 620, color: XYZColor(0.69151, 0.30834, 15e-5) },
      { wavelength: 625, color: XYZColor(0.70061, 0.2993, 9e-5) },
      { wavelength: 630, color: XYZColor(0.70792, 0.29203, 5e-5) },
      { wavelength: 635, color: XYZColor(0.71403, 0.28593, 4e-5) },
      { wavelength: 640, color: XYZColor(0.71903, 0.28094, 3e-5) },
      { wavelength: 645, color: XYZColor(0.72303, 0.27695, 2e-5) },
      { wavelength: 646, color: XYZColor(0.7237, 0.27628, 2e-5) },
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
  }
});

// src/color-and-light/sketches/2d-gamut-test.sketch.ts
var d_gamut_test_sketch_exports = {};
__export(d_gamut_test_sketch_exports, {
  create: () => create2
});
function plot(xyz, x = 200, y = 10, scale2 = 500) {
  return [
    xyz.data[0] * scale2 + x,
    (1 - xyz.data[1]) * scale2 + y
  ];
}
function create2(el) {
  return createP5Sketch(el, (p) => {
    p.setup = () => {
      p.createCanvas(800, 600);
    };
    p.draw = () => {
      p.background(200);
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
  });
}
var init_d_gamut_test_sketch = __esm({
  "src/color-and-light/sketches/2d-gamut-test.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_color();
  }
});

// src/color-and-light/sketches/3d-LSM-color.sketch.ts
var d_LSM_color_sketch_exports = {};
__export(d_LSM_color_sketch_exports, {
  create: () => create3
});
function plot2(color) {
  const x = color.data[0] * 300;
  const y = color.data[1] * 300;
  const z = color.data[2] * 300;
  return [x, y, z];
}
function create3(el) {
  return createP5Sketch(el, (p) => {
    const pointtoplot = Array.from({ length: 500 }).map(() => LMSColor(Math.random(), Math.random(), Math.random()));
    p.setup = () => {
      p.createCanvas(600, 600, p.WEBGL);
    };
    p.draw = () => {
      p.background(230);
      p.orbitControl();
      p.translate(-150, -150, -150);
      p.strokeWeight(3);
      p.stroke(255, 0, 0);
      p.line(-100, 0, 0, 300, 0, 0);
      p.stroke(0, 255, 0);
      p.line(0, -100, 0, 0, 300, 0);
      p.stroke(0, 0, 255);
      p.line(0, 0, -100, 0, 0, 300);
      p.stroke(200);
      p.line(0, 0, 0, 300, 300, 300);
      const size = 8;
      for (const lms of pointtoplot) {
        if (isInGamut(lms)) {
          p.push();
          p.translate(...plot2(lms));
          p.fill(toP5Color(p, lms));
          p.noStroke();
          p.box(size, size, size);
          p.pop();
        }
      }
    };
  });
}
var init_d_LSM_color_sketch = __esm({
  "src/color-and-light/sketches/3d-LSM-color.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_color();
  }
});

// src/_script/input.ts
function createElement(tagName, children = [], options) {
  const wrapper = document.createElement(tagName);
  if (options?.id) {
    wrapper.id = options.id;
  }
  if (options?.class) {
    const classList = typeof options.class === "string" ? options.class.split(" ") : options.class;
    for (const cls of classList) {
      wrapper.classList.add(cls);
    }
  }
  for (const elem of children) {
    if (typeof elem === "string")
      wrapper.appendChild(document.createTextNode(elem));
    else
      wrapper.appendChild(elem);
  }
  if (options?.attributes) {
    for (const key in options.attributes) {
      wrapper.setAttribute(key, options.attributes[key]);
    }
  }
  if (options?.style) {
    for (const key in options?.style) {
      wrapper.style[key] = options?.style[key];
    }
  }
  return wrapper;
}
var InputTable;
var init_input = __esm({
  "src/_script/input.ts"() {
    "use strict";
    InputTable = class {
      constructor(parent) {
        this.table = createElement("table", [], {
          style: {
            borderCollapse: "separate",
            borderSpacing: "8px 0px"
          }
        });
        parent.appendChild(this.table);
      }
      createRangeInput(range) {
        if (range.step === void 0) {
          range.step = range.type === "int" ? 1 : 0.01;
        }
        if (range.value === void 0) {
          range.value = Math.round((range.min + range.max) / range.step / 2) * range.step;
        }
        const slider = createElement(
          "input",
          [],
          {
            attributes: {
              type: "range",
              min: range.min.toString(),
              max: range.max.toString(),
              value: range.value.toString(),
              step: range.step.toString()
            },
            style: {
              width: `${range.width}px`
            }
          }
        );
        if (range.hideFeedback) {
          this.table.appendChild(
            createElement("tr", [
              createElement("td", [range.label], { style: { textAlign: "right" } }),
              createElement("td", [createElement("span", [])]),
              createElement("td", [slider])
            ])
          );
        } else {
          const feedback = createElement("span", [`${range.value}${range.unit ?? ""}`]);
          slider.addEventListener("input", () => {
            feedback.textContent = `${slider.value}${range.unit ?? ""}`;
          });
          this.table.appendChild(
            createElement("tr", [
              createElement("td", [range.label], { style: { textAlign: "right" } }),
              createElement("td", [feedback], { style: { textAlign: "right" } }),
              createElement("td", [slider])
            ])
          );
        }
        return slider;
      }
    };
  }
});

// src/color-and-light/sketches/gamut-convex-hull.sketch.ts
var gamut_convex_hull_sketch_exports = {};
__export(gamut_convex_hull_sketch_exports, {
  create: () => create4
});
function plot3(lms, x = 200, y = 10, scale2 = 500) {
  return [
    lms.data[0] * scale2 + x,
    (1 - lms.data[1]) * scale2 + y
  ];
}
function create4(el) {
  const inputTable = new InputTable(el);
  const wl1Slider = inputTable.createRangeInput({
    label: "Wavelength 1",
    min: 400,
    max: 700,
    value: 500,
    type: "int",
    width: 200,
    unit: "nm"
  });
  const wl2Slider = inputTable.createRangeInput({
    label: "Wavelength 2",
    min: 400,
    max: 700,
    value: 600,
    type: "int",
    width: 200,
    unit: "nm"
  });
  const mixrate = inputTable.createRangeInput({
    label: "Mix Rate",
    min: 0,
    max: 100,
    type: "int",
    width: 200,
    unit: "%"
  });
  return createP5Sketch(el, (p) => {
    p.setup = () => {
      p.createCanvas(800, 600);
    };
    p.draw = () => {
      p.background(200);
      p.noStroke();
      p.fill(255);
      p.beginShape();
      for (const data of monochromaticityData) {
        const lms = toLMS(data.color);
        const pos = plot3(lms);
        p.vertex(...pos);
      }
      p.endShape(p.CLOSE);
      p.strokeWeight(3);
      p.stroke(200);
      let prevPos = null;
      for (const data of monochromaticityData) {
        const lms = toLMS(data.color);
        const pos = plot3(lms);
        if (prevPos) {
          p.stroke(toP5Color(p, data.color));
          p.line(...prevPos, ...pos);
        }
        prevPos = pos;
      }
      const wl1 = parseFloat(wl1Slider.value);
      const wl2 = parseFloat(wl2Slider.value);
      const rate = parseFloat(mixrate.value) / 100;
      const color1 = monochromaticity(wl1);
      const color2 = monochromaticity(wl2);
      const color3 = colorLerp(color1, color2, rate);
      const color1Pos = plot3(toLMS(color1));
      const color2Pos = plot3(toLMS(color2));
      const color3Pos = plot3(toLMS(color3));
      p.stroke(150);
      p.line(...color1Pos, ...color2Pos);
      p.noStroke();
      p.fill(toP5Color(p, color1));
      p.circle(...color1Pos, 20);
      p.fill(toP5Color(p, color2));
      p.circle(...color2Pos, 20);
      p.fill(toP5Color(p, color3));
      p.circle(...color3Pos, 20);
    };
  });
}
var init_gamut_convex_hull_sketch = __esm({
  "src/color-and-light/sketches/gamut-convex-hull.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_color();
    init_input();
  }
});

// src/color-and-light/sketches/metamerism.sketch.ts
var metamerism_sketch_exports = {};
__export(metamerism_sketch_exports, {
  create: () => create5
});
function plot4(lms, x = 200, y = 10, scale2 = 500) {
  const sum = lms.data[0] + lms.data[1] + lms.data[2];
  const normalzed = sum != 0 ? [
    lms.data[0] / sum,
    lms.data[1] / sum,
    lms.data[2] / sum
  ] : [1 / 3, 1 / 3, 1 / 3];
  return [
    normalzed[0] * scale2 + x,
    (1 - normalzed[1]) * scale2 + y
  ];
}
function drawGamut(p, plotParam, options) {
  if (!options.strokeWeight)
    options.strokeWeight = 2;
  p.noStroke();
  if (options.fillColor) {
    p.fill(options.fillColor);
    p.beginShape();
    for (const data of monochromaticityData) {
      const lms = toLMS(data.color);
      const pos = plot4(lms, ...plotParam);
      p.vertex(...pos);
    }
    p.endShape(p.CLOSE);
  }
  p.strokeWeight(options.strokeWeight);
  let prevPos = null;
  for (const data of monochromaticityData) {
    const lms = toLMS(data.color);
    const pos = plot4(lms, ...plotParam);
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
function create5(el, options) {
  const inputTable = new InputTable(el);
  const gainRSlider = inputTable.createRangeInput({
    label: "Gain R",
    min: options.allowNegative ? -100 : 0,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    unit: "%"
  });
  const gainGSlider = inputTable.createRangeInput({
    label: "Gain G",
    min: options.allowNegative ? -100 : 0,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    unit: "%"
  });
  const gainBSlider = inputTable.createRangeInput({
    label: "Gain B",
    min: options.allowNegative ? -100 : 0,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    unit: "%"
  });
  const colorTarget = colorGain(toRGB(monochromaticity(options.targetWavelength || 500)), 0.6);
  const colorR = RGBColor(1, 0, 0);
  const colorG = RGBColor(0, 1, 0);
  const colorB = RGBColor(0, 0, 1);
  return createP5Sketch(el, (p) => {
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
      const plotParam = [500, -50, 300];
      drawGamut(p, plotParam, { fillColor: p.color(50), strokeWeight: 2 });
      const plotG = plot4(toLMS(colorG), ...plotParam);
      const plotR = plot4(toLMS(colorR), ...plotParam);
      const plotB = plot4(toLMS(colorB), ...plotParam);
      const plotTarget = plot4(toLMS(colorTarget), ...plotParam);
      const plotMixed = plot4(toLMS(colorMixed), ...plotParam);
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
      const wallCenter = [250, 200];
      const wallLeft = [wallCenter[0] - wallsize, wallCenter[1] - wallsize];
      const wallRight = [wallCenter[0] + wallsize, wallCenter[1] - wallsize];
      const wallsize2 = 50;
      const wallLeft2 = [wallCenter[0] - wallsize2, wallCenter[1] - wallsize2];
      const wallRight2 = [wallCenter[0] + wallsize2, wallCenter[1] - wallsize2];
      const lightOffset = 20;
      const lightDistance = 200;
      const lightPosTarget = [wallCenter[0] - lightDistance, wallCenter[1] + lightDistance];
      const lightPosG = [wallCenter[0] + lightDistance, wallCenter[1] + lightDistance];
      const lightPosR = [lightPosG[0] - lightOffset, lightPosG[1] + lightOffset];
      const lightPosB = [lightPosG[0] + lightOffset, lightPosG[1] - lightOffset];
      const lightPosNegG = [wallCenter[0] - lightDistance - lightOffset, wallCenter[1] + lightDistance - lightOffset];
      const lightPosNegR = [lightPosNegG[0] + 2 * lightOffset, lightPosNegG[1] + 2 * lightOffset];
      const lightPosNegB = [lightPosNegG[0] - lightOffset, lightPosNegG[1] - lightOffset];
      const displayPosX = 650;
      const displayPosY = 400;
      const displaySizeRGB = 150;
      const displaySizeTarget = 130;
      const displayOffset = 20;
      p.stroke(255);
      p.strokeWeight(3);
      p.line(...wallLeft, ...wallCenter);
      p.line(...wallRight, ...wallCenter);
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
      }
      ;
      p.fill(toP5Color(p, colorTarget));
      p.circle(...lightPosTarget, 10);
      p.arc(displayPosX, displayPosY, displaySizeTarget, displaySizeTarget, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
      p.triangle(...wallLeft2, ...wallCenter, ...lightPosTarget);
      p.filter(p.INVERT);
      p.fill(toP5Color(p, colorGain(colorTarget, -1)));
      p.circle(...lightPosTarget, 10);
      p.arc(displayPosX, displayPosY, displaySizeTarget, displaySizeTarget, 0.5 * Math.PI, 1.5 * Math.PI, p.PIE);
      p.triangle(...wallLeft2, ...wallCenter, ...lightPosTarget);
      p.filter(p.INVERT);
    };
  });
}
var init_metamerism_sketch = __esm({
  "src/color-and-light/sketches/metamerism.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_color();
    init_input();
  }
});

// src/color-and-light/sketches/photometry.sketch.ts
var photometry_sketch_exports = {};
__export(photometry_sketch_exports, {
  create: () => create6
});
function create6(el, options) {
  const color1 = RGBColor(...options?.color1 ?? [1, 0, 0]);
  const color2 = RGBColor(...options?.color2 ?? [0, 0, 1]);
  const inputTable = new InputTable(el);
  const gain1Slider = inputTable.createRangeInput({
    label: "gain 1",
    min: 0,
    max: 100,
    type: "int",
    width: 200,
    unit: "%"
  });
  const gain2Slider = inputTable.createRangeInput({
    label: "gain 2",
    min: 0,
    max: 100,
    type: "int",
    width: 200,
    unit: "%"
  });
  const intervalSlider = inputTable.createRangeInput({
    label: "interval",
    min: 1,
    max: 5,
    type: "int",
    width: 200
  });
  const borderWidthSlider = inputTable.createRangeInput({
    label: "borderWidth",
    min: 1,
    max: 5,
    type: "int",
    width: 200
  });
  return createP5Sketch(el, (p) => {
    p.setup = () => {
      p.createCanvas(800, 600);
    };
    p.draw = () => {
      p.background(0);
      const gain1 = gain1Slider.valueAsNumber / 100;
      const gain2 = gain2Slider.valueAsNumber / 100;
      const interval = intervalSlider.valueAsNumber;
      const borderWidth = borderWidthSlider.valueAsNumber;
      if (p.frameCount % (intervalSlider.valueAsNumber * 2) < intervalSlider.valueAsNumber) {
        p.noStroke();
        p.fill(toP5Color(p, colorGain(color1, gain1)));
      } else {
        p.noStroke();
        p.fill(toP5Color(p, colorGain(color2, gain2)));
      }
      p.circle(250, 300, 200);
      const borderLeft = 500;
      const borderRight = 700;
      const borderTop = 200;
      const borderBottom = 400;
      for (let i = 0, x = borderLeft; x < borderRight; i += 1, x = borderLeft + i * borderWidth) {
        if (i % 2 === 0)
          p.fill(toP5Color(p, colorGain(color1, gain1)));
        else
          p.fill(toP5Color(p, colorGain(color2, gain2)));
        const width = Math.min(borderWidth, borderRight - x);
        p.rect(x, borderTop, width, borderBottom - borderTop);
      }
    };
  });
}
var init_photometry_sketch = __esm({
  "src/color-and-light/sketches/photometry.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_color();
    init_input();
  }
});

// src/color-and-light/sketches/sine-wave.sketch.ts
var sine_wave_sketch_exports = {};
__export(sine_wave_sketch_exports, {
  create: () => create7
});
function create7(el) {
  return createP5Sketch(el, (p) => {
    p.setup = () => {
      p.createCanvas(800, 600);
    };
    p.draw = () => {
      p.background(255);
      const phase = -(p.millis() / 1e3) * 2 * p.PI * 0.5;
      const amplitude = 100;
      const frequency = 0.01;
      p.stroke(0);
      p.noFill();
      p.beginShape();
      for (let x = 0; x < p.width; x++) {
        const y = p.height / 2 + amplitude * Math.sin(frequency * x + phase);
        p.vertex(x, y);
      }
      p.endShape();
      p.line(0, p.height / 2, p.width, p.height / 2);
      p.line(30, 0, 30, p.height);
    };
  });
}
var init_sine_wave_sketch = __esm({
  "src/color-and-light/sketches/sine-wave.sketch.ts"() {
    "use strict";
    init_sketch_helper();
  }
});

// src/projection-and-perspective/sketches/ellipse-and-line.sketch.ts
var ellipse_and_line_sketch_exports = {};
__export(ellipse_and_line_sketch_exports, {
  create: () => create8
});
function create8(el, options) {
  return createP5Sketch(el, (p) => {
    let camera;
    p.setup = () => {
      p.createCanvas(640, 480);
    };
    p.draw = () => {
      const ratio = 0.5;
      const radius = 150;
      const length = 400;
      const t = p.millis() / 1e3;
      const angle = p.lerp(0.26, 0.4, Math.sin(t) * 0.5 + 0.5) * 2 * Math.PI;
      const pos = [Math.sin(angle) * radius, Math.cos(angle) * radius];
      const slope = -Math.tan(angle);
      const intercept = pos[1] - slope * pos[0];
      p.background(255);
      p.translate(p.width / 2, p.height / 2);
      const N = 64;
      p.noStroke();
      p.fill("#faa");
      p.beginShape();
      p.vertex(-pos[0], pos[1] * ratio);
      p.vertex(pos[0], pos[1] * ratio);
      for (let i = 0; i < N + 1; i++) {
        const theta = i / N * Math.PI * 2;
        if (pos[1] > -Math.cos(theta) * radius) continue;
        p.vertex(Math.sin(theta) * radius, -Math.cos(theta) * radius * ratio);
      }
      p.endShape();
      p.noStroke();
      p.fill("#aaf");
      p.beginShape();
      p.vertex(-pos[0], pos[1] * ratio);
      p.vertex(pos[0], pos[1] * ratio);
      for (let i = 0; i < N + 1; i++) {
        const theta = i / N * Math.PI * 2;
        if (pos[1] < Math.cos(theta) * radius) continue;
        p.vertex(Math.sin(theta) * radius, Math.cos(theta) * radius * ratio);
      }
      p.endShape();
      p.stroke("#000");
      p.noFill();
      p.strokeWeight(2);
      p.ellipse(0, 0, radius * 2, radius * 2 * ratio);
      p.line(pos[0], pos[1] * ratio, -pos[0], pos[1] * ratio);
      p.line(0, intercept * ratio, length, intercept * ratio + slope * length * ratio);
      p.line(0, intercept * ratio, -length, intercept * ratio + slope * length * ratio);
    };
  });
}
var init_ellipse_and_line_sketch = __esm({
  "src/projection-and-perspective/sketches/ellipse-and-line.sketch.ts"() {
    "use strict";
    init_sketch_helper();
  }
});

// src/projection-and-perspective/sketches/objects.ts
function setStyle(p, strokeColor, fillColor) {
  if (strokeColor === void 0) p.noStroke();
  else p.stroke(strokeColor);
  if (fillColor === void 0) p.noFill();
  else p.fill(fillColor);
}
var Point, Line, Label, Circle, Box;
var init_objects = __esm({
  "src/projection-and-perspective/sketches/objects.ts"() {
    "use strict";
    init_linearalgebra();
    Point = class _Point {
      constructor(center, color = "#000") {
        this.center = center;
        this.color = color;
      }
      render(p) {
        _Point.render(p, this.center, this.color);
      }
      static render(p, center, color = "#000") {
        p.push();
        p.translate(...center);
        setStyle(p, void 0, color);
        p.sphere(2, 8, 8);
        p.pop();
      }
    };
    Line = class _Line {
      constructor(start, end, color = "#000") {
        this.start = start;
        this.end = end;
        this.color = color;
      }
      render(p) {
        _Line.render(p, this.start, this.end, this.color);
      }
      static render(p, start, end, color = "#000") {
        p.push();
        setStyle(p, color, void 0);
        p.line(...start, ...end);
        p.pop();
      }
    };
    Label = class _Label {
      static {
        this.font = null;
      }
      static loadFont(p) {
        if (!_Label.font) {
          _Label.font = p.loadFont("/_assets/MPLUS1p-Regular.ttf");
        }
      }
      constructor(position, text, color = "#000", up, right) {
        this.position = position;
        this.text = text;
        this.color = color;
        this.up = up ? normalize(up) : void 0;
        this.right = right ? normalize(right) : void 0;
      }
      render(p) {
        _Label.render(p, this.position, this.text, this.color, this.up, this.right);
      }
      static render(p, position, text, color = "#000", up_, right_) {
        if (!_Label.font) {
          return;
        }
        const up = up_ ? normalize(up_) : void 0;
        const right = right_ ? normalize(right_) : void 0;
        p.push();
        const gl = p._renderer.GL;
        gl.disable(gl.DEPTH_TEST);
        setStyle(p, void 0, color);
        p.textFont(_Label.font);
        if (up && right) {
          const forward = normalize(cross(up, right));
          p.applyMatrix(
            right[0],
            right[1],
            right[2],
            0,
            -up[0],
            -up[1],
            -up[2],
            0,
            forward[0],
            forward[1],
            forward[2],
            0,
            ...position,
            1
          );
          p.text(text, 5, 10);
        } else {
          const cam = p._renderer._curCamera;
          const eye = [cam.eyeX, cam.eyeY, cam.eyeZ];
          const center = [cam.centerX, cam.centerY, cam.centerZ];
          const up2 = [cam.upX, cam.upY, cam.upZ];
          const forward = normalize(sub(center, eye));
          const right2 = normalize(cross(forward, up2));
          const trueUp = cross(right2, forward);
          p.applyMatrix(
            right2[0],
            right2[1],
            right2[2],
            0,
            trueUp[0],
            trueUp[1],
            trueUp[2],
            0,
            -forward[0],
            -forward[1],
            -forward[2],
            0,
            ...position,
            1
          );
          p.text(text, 5, 10);
        }
        gl.enable(gl.DEPTH_TEST);
        p.pop();
      }
    };
    Circle = class _Circle {
      constructor(center, radius, axis = [0, 0, 1], color = "#000") {
        this.center = center;
        this.radius = radius;
        this.axis = axis;
        this.color = color;
      }
      render(p) {
        _Circle.render(p, this.center, this.radius, this.axis, this.color);
      }
      static render(p, center, radius, axis, color) {
        axis = normalize(axis);
        const angle = Math.acos(axis[2]);
        p.push();
        p.translate(...center);
        if (angle != 0) {
          const rotAxis = cross(axis, [0, 0, 1]);
          p.rotate(angle, rotAxis);
        }
        setStyle(p, color, void 0);
        p.beginShape();
        const N = 64;
        for (let i = 0; i < N; i++) {
          const theta = i / N * 2 * Math.PI;
          p.vertex(Math.cos(theta) * radius, Math.sin(theta) * radius);
        }
        p.endShape(p.CLOSE);
        p.pop();
      }
    };
    Box = class _Box {
      constructor(center, size, rotation = [0, 0, 0], color = "#000") {
        this.center = center;
        this.size = size;
        this.rotation = rotation;
        this.color = color;
      }
      render(p) {
        _Box.render(p, this.center, this.size, this.rotation, this.color);
      }
      static render(p, center, size, rotation = [0, 0, 0], color = "#000") {
        p.push();
        p.translate(...center);
        p.rotateX(rotation[0]);
        p.rotateY(rotation[1]);
        p.rotateZ(rotation[2]);
        setStyle(p, color, void 0);
        p.box(...size);
        p.pop();
      }
    };
  }
});

// src/projection-and-perspective/sketches/idealCamera.ts
function resetAs2D(p) {
  p.resetMatrix();
  p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, 0, 1e3);
  p.camera(p.width / 2, p.height / 2, 500, p.width / 2, p.height / 2, 0, 0, 1, 0);
}
var IdealCamera;
var init_idealCamera = __esm({
  "src/projection-and-perspective/sketches/idealCamera.ts"() {
    "use strict";
    init_linearalgebra();
    init_objects();
    IdealCamera = class {
      constructor(eye, target, width, height, p) {
        this.up = [0, -1, 0];
        this.history = /* @__PURE__ */ new Map();
        this.historyLifespan = 3e3;
        this.eye = eye;
        this.target = target;
        this.width = width;
        this.height = height;
        if (p) this.innerCanvas = p.createGraphics(width, height, p.WEBGL);
      }
      solve(point) {
        const dir = normalize(sub(point, this.eye));
        const axis = sub(this.target, this.eye);
        const t = dot(axis, axis) / dot(axis, dir);
        if (t < 0) return void 0;
        return add(this.eye, scale(dir, t));
      }
      solve_virtual(point) {
        const dir = normalize(sub(point, this.eye));
        const axis = sub(this.target, this.eye);
        const t = dot(axis, axis) / dot(axis, dir);
        if (t > 0) return void 0;
        return add(this.eye, scale(dir, t));
      }
      innerSetCamera() {
        if (!this.innerCanvas) return;
        this.innerCanvas.camera(...this.eye, ...this.target, ...this.up);
        const distance = mag(sub(this.target, this.eye));
        const fovy = 2 * Math.atan(this.height / 2 / distance);
        this.innerCanvas.perspective(fovy, this.width / this.height, 0.1, 1e3);
      }
      innerRender(objects) {
        if (!this.innerCanvas) return;
        this.innerSetCamera();
        for (const obj of objects) {
          obj.render(this.innerCanvas);
        }
      }
      canvasRender(p) {
        if (!this.innerCanvas) return;
        const screenPos = [20, 20];
        p.push();
        resetAs2D(p);
        p.image(this.innerCanvas, ...screenPos);
        p.noFill();
        p.stroke("#000");
        p.rect(...screenPos, this.width, this.height);
        p.pop();
        this.innerCanvas.background(255);
      }
      outerRender(p, options = {}) {
        if (options.target === void 0) options.target = false;
        if (options.axis === void 0) options.axis = false;
        if (options.critical === void 0) options.critical = false;
        if (options.axislabel === void 0) options.axislabel = false;
        Point.render(p, this.eye, "#000");
        if (options.target) {
          Point.render(p, this.target, "#000");
        }
        if (options.axis) {
          Line.render(p, this.eye, this.target, "#000");
        }
        const forward = normalize(sub(this.target, this.eye));
        const right = normalize(cross(this.up, forward));
        const up = normalize(cross(right, forward));
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        p.push();
        p.translate(...this.target);
        p.stroke("#000");
        p.noFill();
        p.beginShape();
        p.vertex(...add(scale(right, -halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, -halfHeight)));
        p.vertex(...add(scale(right, halfWidth), scale(up, halfHeight)));
        p.vertex(...add(scale(right, -halfWidth), scale(up, halfHeight)));
        p.endShape(p.CLOSE);
        p.pop();
        if (options.critical) {
          p.push();
          p.translate(...this.eye);
          p.stroke("#f00");
          p.noFill();
          p.beginShape();
          p.vertex(...add(scale(right, -halfWidth), scale(up, -halfHeight)));
          p.vertex(...add(scale(right, halfWidth), scale(up, -halfHeight)));
          p.vertex(...add(scale(right, halfWidth), scale(up, halfHeight)));
          p.vertex(...add(scale(right, -halfWidth), scale(up, halfHeight)));
          p.endShape(p.CLOSE);
          p.pop();
        }
        const planeLabelPos = add(add(this.target, scale(right, halfWidth)), scale(up, halfHeight - 5));
        const criticalLabelPos = add(add(this.eye, scale(right, halfWidth)), scale(up, halfHeight - 5));
        Label.render(p, this.eye, "\u8996\u70B9 E");
        if (options.target) {
          Label.render(p, this.target, "\u8996\u5FC3 O");
        }
        if (options.axis) {
          Label.render(p, add(scale(up, -14), scale(add(this.eye, this.target), 0.5)), "\u8996\u8EF8", "#000", up, forward);
        }
        Label.render(p, planeLabelPos, "\u6295\u5F71\u9762", "#000", up, scale(right, -1));
        if (options.critical) {
          Label.render(p, criticalLabelPos, "\u81E8\u754C\u9762", "#f00", up, scale(right, -1));
        }
      }
      // ms
      renderTrace(p, point, id = 0, pointColor = "#000", imageColor = "#f00", virtualImageColor, options = {}) {
        const renderInner = options.renderInner ?? false;
        const renderImageLocus = options.renderImageLocus ?? false;
        const renderPointLocus = options.renderPointLocus ?? false;
        const renderInnerLocus = options.renderInnerLocus ?? false;
        const extension = options.extension ?? 10;
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
          Line.render(p, this.eye, point_extended, imageColor);
          Line.render(p, this.eye, image_extended, imageColor);
        }
        if (vImage && virtualImageColor) {
          const point_extended = add(point, scale(normalize(sub(point, this.eye)), extension));
          const image_extended = add(vImage, scale(normalize(sub(vImage, this.eye)), extension));
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
            p.strokeWeight(alpha);
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
            p.strokeWeight(alpha);
            Line.render(p, p1, p2, imageColor);
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
            p.strokeWeight(alpha);
            Line.render(p, p1, p2, virtualImageColor);
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
              this.innerCanvas.strokeWeight(alpha);
              Line.render(this.innerCanvas, p1, p2, imageColor);
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
              this.innerCanvas.strokeWeight(alpha);
              Line.render(this.innerCanvas, p1, p2, virtualImageColor);
              this.innerCanvas.pop();
            }
          }
        }
      }
    };
  }
});

// src/projection-and-perspective/sketches/ideal-camera-test.sketch.ts
var ideal_camera_test_sketch_exports = {};
__export(ideal_camera_test_sketch_exports, {
  create: () => create9
});
function create9(el) {
  return createP5Sketch(el, (p) => {
    let scene = [];
    let labels = [];
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      p.frameRate(30);
      camera = new IdealCamera([200, 0, 0], [-30, 0, 0], 200, 150, p);
      scene.push(new Box([-100, -20, -60], [80, 60, 80], [0, 0.4, 0]));
      scene.push(new Box([-100, 10, 60], [60, 120, 60], [0, -0.3, 0]));
      const posA = [-100, 20, -60];
      const solved = camera.solve(posA);
      scene.push(new Line(posA, [200, 0, 0], "#000"));
      scene.push(new Point(solved, "#000"));
      p.camera(500, 500, 500, 0, 0, 0, 0, -1, 0);
    };
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      scene.forEach((obj) => obj.render(p));
      const t = p.millis() / 1e3;
      const point = [100 * Math.cos(t) + 130, 100, 100 * Math.sin(t)];
      camera.renderTrace(
        p,
        point,
        0,
        "#000",
        "#f00",
        "#00f",
        {
          renderPointLocus: true,
          renderImageLocus: true,
          renderInner: true,
          renderInnerLocus: true
        }
      );
      camera.outerRender(p);
      labels.forEach((label) => label.render(p));
      camera.innerRender(scene);
      camera.canvasRender(p);
    };
  });
}
var init_ideal_camera_test_sketch = __esm({
  "src/projection-and-perspective/sketches/ideal-camera-test.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
  }
});

// src/projection-and-perspective/sketches/ideal-camera1.sketch.ts
var ideal_camera1_sketch_exports = {};
__export(ideal_camera1_sketch_exports, {
  create: () => create10
});
function create10(el) {
  return createP5Sketch(el, (p) => {
    let scene = [];
    let labels = [];
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      camera = new IdealCamera([200, 0, 0], [-30, 0, 0], 200, 150, p);
      p.camera(500, 500, 500, 0, 0, 0, 0, -1, 0);
    };
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      scene.forEach((obj) => obj.render(p));
      camera.outerRender(p, { target: true, axis: true, axislabel: true });
      labels.forEach((label) => label.render(p));
    };
  });
}
var init_ideal_camera1_sketch = __esm({
  "src/projection-and-perspective/sketches/ideal-camera1.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
  }
});

// src/projection-and-perspective/sketches/ideal-camera2.sketch.ts
var ideal_camera2_sketch_exports = {};
__export(ideal_camera2_sketch_exports, {
  create: () => create11
});
function create11(el) {
  return createP5Sketch(el, (p) => {
    let scene = [];
    let labels = [];
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      camera = new IdealCamera([200, 0, 0], [30, 0, 0], 200, 150, p);
      p.camera(500, 500, 500, 0, 0, 0, 0, -1, 0);
    };
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      const t = p.millis() / 1e3;
      const point = [Math.sin(t) * 50 - 100, Math.sin(t * 2) * 50, Math.sin(t * 3) * 50];
      camera.renderTrace(p, point, 0, "#000", "#f00", void 0, {
        renderInner: true,
        renderImageLocus: true,
        renderPointLocus: true,
        renderInnerLocus: true
      });
      camera.outerRender(p, { target: false, axis: false, axislabel: false });
      labels.forEach((label) => label.render(p));
      camera.canvasRender(p);
    };
  });
}
var init_ideal_camera2_sketch = __esm({
  "src/projection-and-perspective/sketches/ideal-camera2.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
  }
});

// src/projection-and-perspective/sketches/image-of-circle-all.sketch.ts
var image_of_circle_all_sketch_exports = {};
__export(image_of_circle_all_sketch_exports, {
  create: () => create12
});
function create12(el) {
  return createP5Sketch(el, (p) => {
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);
      p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0);
    };
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      const t = p.millis() / 1e3 - 2 + 12;
      const a = 20;
      const r = 40;
      const y = -15;
      const z = t % 6 < 2 ? Math.cos(t * Math.PI) * a - a : t % 6 < 3 ? 0 : t % 6 < 5 ? -Math.cos((t - 3) * Math.PI) * a + a : 0;
      const circle1 = new Circle([0, y, z + r], r, [0, 1, 0], "#e00");
      const circle2 = new Circle([0, -y, -z - r], r, [0, 1, 0], "#00f");
      if (3 < t % 12 && t % 12 < 9) {
        const N = 16;
        for (let i = 0; i < N; i += 1) {
          const theta = i / N * 2 * Math.PI;
          const point = new Point([Math.cos(theta) * r, y, z + Math.sin(theta) * r + r], "#000");
          camera.renderTrace(p, point.center, 0, "#000", "#e00", "#00f");
          point.render(p);
        }
      }
      circle1.render(p);
      camera.outerRender(p, { critical: true });
      camera.innerRender([circle1, circle2]);
      camera.canvasRender(p);
      p.push();
      resetAs2D(p);
      p.textSize(30);
      const pos = [20, 200, 0];
      if (0 < z) Label.render(p, pos, "\u6955\u5186", "#000");
      else if (z < 0) Label.render(p, pos, "\u53CC\u66F2\u7DDA", "#000");
      else Label.render(p, pos, "\u653E\u7269\u7DDA", "#000");
      p.pop();
    };
  });
}
var init_image_of_circle_all_sketch = __esm({
  "src/projection-and-perspective/sketches/image-of-circle-all.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
  }
});

// src/projection-and-perspective/sketches/image-of-circle-and-parallel.sketch.ts
var image_of_circle_and_parallel_sketch_exports = {};
__export(image_of_circle_and_parallel_sketch_exports, {
  create: () => create13
});
function create13(el, options) {
  return createP5Sketch(el, (p) => {
    let camera;
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      p.camera(0, 200, 0, 0, 0, 0, 0, 0, -1);
      p.perspective(60 * Math.PI / 180, 640 / 480, 1, 1e3);
    };
    p.draw = () => {
      const t = p.millis() / 1e3 % 6;
      p.background(255);
      const angle = t < 2 ? 0 : t < 3 ? t % 1 : t < 5 ? 1 : 1 - t % 1;
      p.rotateX(angle);
      const radius = 80;
      const length = 400;
      const N = 32;
      p.fill("#faa");
      p.noStroke();
      p.beginShape();
      for (let i = 0; i < N + 1; i++) {
        const theta = i / N * Math.PI;
        p.vertex(Math.cos(theta) * radius, 0, -Math.sin(theta) * radius);
      }
      p.endShape();
      p.fill("#aaf");
      p.noStroke();
      p.beginShape();
      for (let i = 0; i < N + 1; i++) {
        const theta = i / N * Math.PI;
        p.vertex(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
      }
      p.endShape();
      Circle.render(p, [0, 0, 0], radius, [0, 1, 0], "#000");
      Line.render(p, [radius, 0, -length], [radius, 0, length], "#000");
      Line.render(p, [-radius, 0, -length], [-radius, 0, length], "#000");
      Line.render(p, [radius, 1, 0], [-radius, 1, 0], "#000");
    };
  });
}
var init_image_of_circle_and_parallel_sketch = __esm({
  "src/projection-and-perspective/sketches/image-of-circle-and-parallel.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
  }
});

// src/projection-and-perspective/sketches/image-of-circle-basic.sketch.ts
var image_of_circle_basic_sketch_exports = {};
__export(image_of_circle_basic_sketch_exports, {
  create: () => create14
});
function create14(el, options) {
  return createP5Sketch(el, (p) => {
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      p.camera(-300, 300, -300, 0, 0, 0, 0, -1, 0);
    };
    p.draw = () => {
      const t = p.millis() / 1e3;
      p.background(255);
      p.orbitControl();
      if (options.roll) p.rotateZ(t);
      Circle.render(p, [0, 0, 0], 80, [0, 1, 0], "#000");
      Line.render(p, [0, -100, 0], [0, 100, 0], "#000");
      if (options.grid) {
        let N = 3;
        const size = 40;
        const length = size * N;
        for (let i = -3; i <= 3; i++) {
          Line.render(p, [i * size, 0, length], [i * size, 0, -length], "#aaa");
          Line.render(p, [length, 0, i * size], [-length, 0, i * size], "#aaa");
        }
      }
    };
  });
}
var init_image_of_circle_basic_sketch = __esm({
  "src/projection-and-perspective/sketches/image-of-circle-basic.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
  }
});

// src/projection-and-perspective/sketches/image-of-point.sketch.ts
var image_of_point_sketch_exports = {};
__export(image_of_point_sketch_exports, {
  create: () => create15
});
function create15(el) {
  const inputTable = new InputTable(el);
  const xSlider = inputTable.createRangeInput({
    label: "\u5DE6\u53F3",
    min: -100,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    hideFeedback: true
  });
  const ySlider = inputTable.createRangeInput({
    label: "\u4E0A\u4E0B",
    min: -100,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    hideFeedback: true
  });
  const zSlider = inputTable.createRangeInput({
    label: "\u524D\u5F8C",
    min: -100,
    max: 100,
    value: 50,
    type: "int",
    width: 200,
    hideFeedback: true
  });
  const span = createElement("span");
  el.appendChild(span);
  return createP5Sketch(el, (p) => {
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150);
      p.camera(-300, 300, -300, 0, 0, 0, 0, -1, 0);
    };
    let lastResult = null;
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      const x = xSlider.valueAsNumber / 100;
      const y = ySlider.valueAsNumber / 100;
      const z = zSlider.valueAsNumber / 100;
      const point = [x * 120, y * 120, z * 120];
      const newResult = camera.solve(point);
      if (lastResult != !!newResult) {
        lastResult = !!newResult;
        if (newResult) {
          span.textContent = "\u70B9\u306E\u50CF\u306F\u5B58\u5728\u3057\u307E\u3059";
        } else {
          span.textContent = "\u70B9\u306E\u50CF\u306F\u5B58\u5728\u3057\u307E\u305B\u3093";
        }
      }
      if (newResult) Label.render(p, newResult, "\u50CF", "#000");
      camera.renderTrace(p, point);
      camera.outerRender(p, { target: false, axis: false, axislabel: false, critical: true });
    };
  });
}
var init_image_of_point_sketch = __esm({
  "src/projection-and-perspective/sketches/image-of-point.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
    init_input();
  }
});

// src/projection-and-perspective/sketches/image-of-shape.sketch.ts
var image_of_shape_sketch_exports = {};
__export(image_of_shape_sketch_exports, {
  create: () => create16
});
function create16(el) {
  return createP5Sketch(el, (p) => {
    let scene = [];
    let labels = [];
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      camera = new IdealCamera([0, 0, 0], [0, 0, 100], 200, 150, p);
      scene.push(new Circle([-20, 0, 200], 80, [0, 0, 1], "#e00"));
      scene.push(new Circle([10, 0, 100], 40, [0, 0, 1], "#0a0"));
      const up = [0, 1, 0];
      const right = [1, 0, 0];
      labels.push(new Label([-35, 5, 200], "\u56F3\u5F62S", "#e00", up, right));
      labels.push(new Label([-5, 5, 100], "\u56F3\u5F62S'", "#0a0", up, right));
      p.camera(-300, 300, -300, 0, 0, 100, 0, -1, 0);
    };
    p.draw = () => {
      p.background(255);
      p.orbitControl();
      scene.forEach((obj) => obj.render(p));
      const A = [-80, 0, 200];
      const a = camera.solve(A);
      const B = [40, 0, 100];
      camera.renderTrace(p, A, 0, "#e00", "#e00", void 0, { renderInner: true });
      camera.renderTrace(p, B, 0, "#0a0", "#0a0", void 0, { renderInner: true, extension: 130 });
      Label.render(p, A, "\u70B9A", "#000");
      Label.render(p, B, "\u70B9b", "#000");
      Label.render(p, a, "\u70B9a", "#000");
      camera.outerRender(p);
      labels.forEach((label) => label.render(p));
      camera.innerRender(scene);
      camera.canvasRender(p);
    };
  });
}
var init_image_of_shape_sketch = __esm({
  "src/projection-and-perspective/sketches/image-of-shape.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
  }
});

// src/projection-and-perspective/sketches/symmetry-of-camera.sketch.ts
var symmetry_of_camera_sketch_exports = {};
__export(symmetry_of_camera_sketch_exports, {
  create: () => create17
});
function create17(el, options) {
  return createP5Sketch(el, (p) => {
    let objects = [];
    let grid = [];
    let camera;
    p.preload = () => {
      Label.loadFont(p);
    };
    p.setup = () => {
      p.createCanvas(640, 480, p.WEBGL);
      objects.push(new Box([-80, -20, -60], [80, 60, 80], [0, 0.4, 0]));
      objects.push(new Box([-130, 10, 60], [60, 120, 60], [0, -0.1, 0]));
      objects.push(new Box([-10, -50, 20], [30, 20, 30], [0, -0.6, 0]));
      const gridY = -30;
      for (let x = -200; x <= 200; x += 50) {
        grid.push(new Line([x, gridY, -200], [x, gridY, 200], "#ccc"));
        grid.push(new Line([-200, gridY, x], [200, gridY, x], "#ccc"));
      }
      camera = new IdealCamera([100, 0, 0], [-30, 0, 0], 200, 150, p);
      p.camera(500, 500, -500, 0, 0, 0, 0, -1, 0);
      p.noiseDetail(2, 0.5);
    };
    p.draw = () => {
      const phase = p.millis() / 6e3 % 1 * 2 * Math.PI;
      const mode = options.mode || "roll";
      const whatToMove = options.whatToMove || "camera";
      if (options.mode == "zoom" || options.mode == "dolly-zoom") {
        const distance = Math.sin(phase) * 50 + 130;
        if (options.mode == "dolly-zoom") {
          camera.eye[0] = camera.target[0] + distance;
        }
        if (options.mode == "zoom") {
          camera.target[0] = camera.eye[0] - distance;
        }
      }
      const rollAngle = phase;
      const panAngle = Math.sin(phase) * 0.2;
      const tiltAngle = Math.sin(phase * 2) * 0.2;
      const offsetAmount = 40 - Math.cos(phase * 2) * 40;
      const pallalelOffset = phase < Math.PI ? [offsetAmount, 0, 0] : [0, 0, offsetAmount];
      const t = p.millis() / 1e3 * 0.5;
      const randomOffset = [
        p.noise(t, 0) * 2 - 1,
        p.noise(0, t) * 2 - 1,
        p.noise(t, t) * 2 - 1
      ].map((x) => x * 50);
      const randomRotation = [
        p.noise(t + 100, 0) * 2 - 1,
        p.noise(0, t + 100) * 2 - 1,
        p.noise(t + 100, t + 100) * 2 - 1
      ].map((x) => x * Math.PI * 0.3);
      p.background(255);
      p.orbitControl();
      p.push();
      if (whatToMove == "objects" || whatToMove == "both") {
        if (mode == "roll") {
          p.rotateX(rollAngle);
        }
        if (mode == "pan-tilt") {
          p.translate(...camera.eye);
          p.rotateZ(tiltAngle);
          p.rotateY(panAngle);
          p.translate(...scale(camera.eye, -1));
        }
        if (mode == "parallel") {
          p.translate(...pallalelOffset);
        }
        if (mode == "random") {
          p.rotateX(randomRotation[0]);
          p.rotateY(randomRotation[1]);
          p.rotateZ(randomRotation[2]);
          p.translate(...randomOffset);
        }
      }
      objects.forEach((obj) => obj.render(p));
      p.pop();
      p.push();
      if (whatToMove == "camera" || whatToMove == "both") {
        if (mode == "roll") {
          p.rotateX(rollAngle);
        }
        if (mode == "pan-tilt") {
          p.translate(...camera.eye);
          p.rotateZ(tiltAngle);
          p.rotateY(panAngle);
          p.translate(...scale(camera.eye, -1));
        }
        if (mode == "parallel") {
          p.translate(...pallalelOffset);
        }
        if (mode == "random") {
          p.rotateX(randomRotation[0]);
          p.rotateY(randomRotation[1]);
          p.rotateZ(randomRotation[2]);
          p.translate(...randomOffset);
        }
      }
      camera.outerRender(p);
      p.pop();
      if (whatToMove == "camera" || whatToMove == "both") {
        if (mode == "roll") {
          camera.innerCanvas.rotateX(-rollAngle);
        }
        if (mode == "pan-tilt") {
          camera.innerCanvas.translate(...camera.eye);
          camera.innerCanvas.rotateY(-panAngle);
          camera.innerCanvas.rotateZ(-tiltAngle);
          camera.innerCanvas.translate(...scale(camera.eye, -1));
        }
        if (mode == "parallel") {
          camera.innerCanvas.translate(...scale(pallalelOffset, -1));
        }
        if (mode == "random") {
          camera.innerCanvas.translate(...scale(randomOffset, -1));
          camera.innerCanvas.rotateZ(-randomRotation[2]);
          camera.innerCanvas.rotateY(-randomRotation[1]);
          camera.innerCanvas.rotateX(-randomRotation[0]);
        }
      }
      if (whatToMove == "objects" || whatToMove == "both") {
        if (mode == "roll") {
          camera.innerCanvas.rotateX(rollAngle);
        }
        if (mode == "pan-tilt") {
          camera.innerCanvas.translate(...camera.eye);
          camera.innerCanvas.rotateZ(tiltAngle);
          camera.innerCanvas.rotateY(panAngle);
          camera.innerCanvas.translate(...scale(camera.eye, -1));
        }
        if (mode == "parallel") {
          camera.innerCanvas.translate(...pallalelOffset);
        }
        if (mode == "random") {
          camera.innerCanvas.rotateX(randomRotation[0]);
          camera.innerCanvas.rotateY(randomRotation[1]);
          camera.innerCanvas.rotateZ(randomRotation[2]);
          camera.innerCanvas.translate(...randomOffset);
        }
      }
      camera.innerRender(objects);
      camera.innerCanvas.resetMatrix();
      camera.canvasRender(p);
    };
  });
}
var init_symmetry_of_camera_sketch = __esm({
  "src/projection-and-perspective/sketches/symmetry-of-camera.sketch.ts"() {
    "use strict";
    init_sketch_helper();
    init_objects();
    init_idealCamera();
    init_linearalgebra();
  }
});

// src/_script/sketch-manifest.ts
var sketchManifest = {
  "_script/sketches/test-sketch": { loader: () => Promise.resolve().then(() => (init_test_sketch_sketch(), test_sketch_sketch_exports)) },
  "color-and-light/sketches/2d-gamut-test": { loader: () => Promise.resolve().then(() => (init_d_gamut_test_sketch(), d_gamut_test_sketch_exports)) },
  "color-and-light/sketches/3d-LSM-color": { loader: () => Promise.resolve().then(() => (init_d_LSM_color_sketch(), d_LSM_color_sketch_exports)) },
  "color-and-light/sketches/gamut-convex-hull": { loader: () => Promise.resolve().then(() => (init_gamut_convex_hull_sketch(), gamut_convex_hull_sketch_exports)) },
  "color-and-light/sketches/metamerism": { loader: () => Promise.resolve().then(() => (init_metamerism_sketch(), metamerism_sketch_exports)) },
  "color-and-light/sketches/photometry": { loader: () => Promise.resolve().then(() => (init_photometry_sketch(), photometry_sketch_exports)) },
  "color-and-light/sketches/sine-wave": { loader: () => Promise.resolve().then(() => (init_sine_wave_sketch(), sine_wave_sketch_exports)) },
  "projection-and-perspective/sketches/ellipse-and-line": { loader: () => Promise.resolve().then(() => (init_ellipse_and_line_sketch(), ellipse_and_line_sketch_exports)) },
  "projection-and-perspective/sketches/ideal-camera-test": { loader: () => Promise.resolve().then(() => (init_ideal_camera_test_sketch(), ideal_camera_test_sketch_exports)) },
  "projection-and-perspective/sketches/ideal-camera1": { loader: () => Promise.resolve().then(() => (init_ideal_camera1_sketch(), ideal_camera1_sketch_exports)) },
  "projection-and-perspective/sketches/ideal-camera2": { loader: () => Promise.resolve().then(() => (init_ideal_camera2_sketch(), ideal_camera2_sketch_exports)) },
  "projection-and-perspective/sketches/image-of-circle-all": { loader: () => Promise.resolve().then(() => (init_image_of_circle_all_sketch(), image_of_circle_all_sketch_exports)) },
  "projection-and-perspective/sketches/image-of-circle-and-parallel": { loader: () => Promise.resolve().then(() => (init_image_of_circle_and_parallel_sketch(), image_of_circle_and_parallel_sketch_exports)) },
  "projection-and-perspective/sketches/image-of-circle-basic": { loader: () => Promise.resolve().then(() => (init_image_of_circle_basic_sketch(), image_of_circle_basic_sketch_exports)) },
  "projection-and-perspective/sketches/image-of-point": { loader: () => Promise.resolve().then(() => (init_image_of_point_sketch(), image_of_point_sketch_exports)) },
  "projection-and-perspective/sketches/image-of-shape": { loader: () => Promise.resolve().then(() => (init_image_of_shape_sketch(), image_of_shape_sketch_exports)) },
  "projection-and-perspective/sketches/symmetry-of-camera": { loader: () => Promise.resolve().then(() => (init_symmetry_of_camera_sketch(), symmetry_of_camera_sketch_exports)) }
};

// src/_script/sketches.ts
init_sketch_helper();
var sketchStates = /* @__PURE__ */ new WeakMap();
function searchLoader(path) {
  if (path in sketchManifest) {
    return sketchManifest[path].loader;
  }
  return null;
}
function parseSketchOptions(el) {
  const rawOptions = el.getAttribute("data-options");
  try {
    return JSON.parse(rawOptions ?? "{}");
  } catch (error) {
    console.error("[sketch] failed to parse data-options", error, "raw:", rawOptions);
    return {};
  }
}
function applyVisibilityPolicy(state) {
  if (!state.visible || document.hidden) {
    state.sketch.stop();
    return;
  }
  state.sketch.start();
}
async function mountSketch(el) {
  const path = el.getAttribute("data-path");
  if (!path) return null;
  const options = parseSketchOptions(el);
  try {
    const loader = searchLoader(path);
    if (!loader) {
      console.error(`[sketch] sketch not found, path: ${path}`);
      return null;
    }
    const module = await loader();
    if (typeof module.create !== "function") {
      console.error(`[sketch] create() is not exported: ${path}`);
      return null;
    }
    const rawSketch = await module.create(el, options) || {};
    const sketch = normalizeSketch(el, rawSketch);
    const state = {
      sketch,
      path,
      options,
      visible: false
    };
    applyVisibilityPolicy(state);
    return state;
  } catch (error) {
    console.error(`[sketch] failed to load: ${path}`, error);
    return null;
  }
}
function handleIntersection(entries) {
  for (const entry of entries) {
    const target = entry.target;
    const state = sketchStates.get(target);
    if (!state) continue;
    state.visible = entry.isIntersecting;
    applyVisibilityPolicy(state);
  }
}
function setupVisibilityChangeHandler(states) {
  document.addEventListener("visibilitychange", () => {
    for (const state of states) {
      applyVisibilityPolicy(state);
    }
  });
}
function observeSketches(states) {
  if (states.length === 0) return;
  if (!("IntersectionObserver" in window)) {
    states.forEach((state) => {
      state.visible = true;
      applyVisibilityPolicy(state);
    });
    return;
  }
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.01
  });
  for (const state of states) {
    sketchStates.set(state.sketch.el, state);
    observer.observe(state.sketch.el);
  }
}
function initSketches() {
  const elements = Array.from(document.querySelectorAll(".sketch"));
  void (async () => {
    const mounted = await Promise.all(elements.map((node) => {
      const el = node;
      return mountSketch(el);
    }));
    const states = mounted.filter((state) => state !== null);
    setupVisibilityChangeHandler(states);
    observeSketches(states);
  })();
}

// src/_script/quizzes.ts
function parseChecklistQuiz(container) {
  const checklist = container.querySelector("ul.checklist");
  if (!checklist) return null;
  const blocks = [...container.children];
  const listIndex = blocks.findIndex((el) => el.contains(checklist));
  if (listIndex === -1) return null;
  const question = blocks.slice(0, listIndex).map((el) => el.outerHTML).join("");
  const explanation = blocks.slice(listIndex + 1).map((el) => el.outerHTML).join("");
  const rawOptions = [...checklist.querySelectorAll("li")].map((li) => li.innerHTML.trim());
  const options = rawOptions.map((raw) => raw.replace(/\s*(?:&#10003;|&#10063;|✓|❏|☐|☑)\s*/, ""));
  const correctIndex = rawOptions.findIndex((raw) => /\s*(?:&#10003;|✓)\s*/.test(raw));
  return {
    question,
    options,
    correctIndex,
    explanation
  };
}
function htmlToElment(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return wrapper.firstElementChild;
}
function buildQuizHtml(quizId, question, options, correctIndex, explanation) {
  if (!question || options.length === 0 || correctIndex === -1)
    return null;
  let html = `<div class="quiz" data-quiz-id="${quizId}" data-correct-index="${correctIndex}">`;
  html += `<div class="quiz-question">${question}</div>`;
  html += `<div class="quiz-options">`;
  options.forEach((option, index) => {
    html += `<label class="quiz-option">`;
    html += `<input type="radio" name="${quizId}" value="${index}">`;
    html += `${option}`;
    html += `</label>`;
  });
  html += `</div>`;
  html += `<div class="quiz-feedback" style="display:none;"></div>`;
  html += `<div class="quiz-explanation" style="display:none;">${explanation}</div>`;
  html += `</div>`;
  return htmlToElment(html);
}
function initQuizzes() {
  const quizzes = document.querySelectorAll(".quiz");
  let quizCounter = 0;
  quizzes.forEach((quiz) => {
    quizCounter++;
    const quizId = `quiz-${quizCounter}`;
    const parsedQuiz = parseChecklistQuiz(quiz.children.length == 1 ? quiz.children[0] : quiz);
    if (!parsedQuiz) {
      console.warn("\u30AF\u30A4\u30BA\u306E\u89E3\u6790\u306B\u5931\u6557\u3057\u307E\u3057\u305F", quiz);
      return;
    }
    const builtQuiz = buildQuizHtml(quizId, parsedQuiz.question, parsedQuiz.options, parsedQuiz.correctIndex, parsedQuiz.explanation);
    if (!builtQuiz) {
      console.warn("\u30AF\u30A4\u30BA\u306E\u69CB\u7BC9\u306B\u5931\u6557\u3057\u307E\u3057\u305F", parsedQuiz);
      return;
    }
    quiz.replaceWith(builtQuiz);
    const correctIndex = parsedQuiz.correctIndex;
    const radioButtons = builtQuiz.querySelectorAll('input[type="radio"]');
    const feedback = builtQuiz.querySelector(".quiz-feedback");
    const explanation = builtQuiz.querySelector(".quiz-explanation");
    if (!quizId || correctIndex === -1 || !feedback || !explanation) {
      console.warn("\u30AF\u30A4\u30BA\u306E\u8A2D\u5B9A\u304C\u4E0D\u5B8C\u5168\u3067\u3059", parsedQuiz);
      return;
    }
    radioButtons.forEach((radio, index) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          const isCorrect = index === correctIndex;
          feedback.style.display = "block";
          if (isCorrect) {
            feedback.textContent = "\u2713 \u6B63\u89E3\u3067\u3059\uFF01";
            feedback.className = "quiz-feedback quiz-feedback-correct";
          } else {
            feedback.textContent = "\u2717 \u4E0D\u6B63\u89E3\u3067\u3059";
            feedback.className = "quiz-feedback quiz-feedback-incorrect";
          }
          explanation.style.display = "block";
          const allOptions = builtQuiz.querySelectorAll(".quiz-option");
          allOptions.forEach((option, optIndex) => {
            if (optIndex === correctIndex) {
              option.classList.add("quiz-option-correct");
            } else if (optIndex === index && !isCorrect) {
              option.classList.add("quiz-option-incorrect");
            } else {
              option.classList.remove("quiz-option-correct", "quiz-option-incorrect");
            }
          });
        }
      });
    });
  });
}

// src/_script/main.ts
document.addEventListener("DOMContentLoaded", () => {
  initSketches();
  initQuizzes();
});
//# sourceMappingURL=main.js.map
