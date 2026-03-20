var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// src/_script/sketches/test-sketch.sketch.ts
var test_sketch_sketch_exports = {};
__export(test_sketch_sketch_exports, {
  create: () => create
});
function create(el) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "90";
  input.value = "45";
  el.appendChild(input);
  el.appendChild(document.createElement("br"));
  new p5((p) => {
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
var init_test_sketch_sketch = __esm({
  "src/_script/sketches/test-sketch.sketch.ts"() {
    "use strict";
  }
});

// src/_script/color.ts
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
function plot(xyz, x = 200, y = 10, scale = 500) {
  return [
    xyz.data[0] * scale + x,
    (1 - xyz.data[1]) * scale + y
  ];
}
function create2(el) {
  new p5((p) => {
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
  }, el);
}
var init_d_gamut_test_sketch = __esm({
  "src/color-and-light/sketches/2d-gamut-test.sketch.ts"() {
    "use strict";
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
  new p5((p) => {
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
  }, el);
}
var init_d_LSM_color_sketch = __esm({
  "src/color-and-light/sketches/3d-LSM-color.sketch.ts"() {
    "use strict";
    init_color();
  }
});

// src/_script/input.ts
function createElement(tagName, children, options) {
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
function plot3(lms, x = 200, y = 10, scale = 500) {
  return [
    lms.data[0] * scale + x,
    (1 - lms.data[1]) * scale + y
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
  new p5((p) => {
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
  }, el);
}
var init_gamut_convex_hull_sketch = __esm({
  "src/color-and-light/sketches/gamut-convex-hull.sketch.ts"() {
    "use strict";
    init_color();
    init_input();
  }
});

// src/color-and-light/sketches/metamerism.sketch.ts
var metamerism_sketch_exports = {};
__export(metamerism_sketch_exports, {
  create: () => create5
});
function plot4(lms, x = 200, y = 10, scale = 500) {
  const sum = lms.data[0] + lms.data[1] + lms.data[2];
  const normalzed = sum != 0 ? [
    lms.data[0] / sum,
    lms.data[1] / sum,
    lms.data[2] / sum
  ] : [1 / 3, 1 / 3, 1 / 3];
  return [
    normalzed[0] * scale + x,
    (1 - normalzed[1]) * scale + y
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
  new p5((p) => {
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
  }, el);
}
var init_metamerism_sketch = __esm({
  "src/color-and-light/sketches/metamerism.sketch.ts"() {
    "use strict";
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
  new p5((p) => {
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
  }, el);
}
var init_photometry_sketch = __esm({
  "src/color-and-light/sketches/photometry.sketch.ts"() {
    "use strict";
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
  new p5((p) => {
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
  }, el);
}
var init_sine_wave_sketch = __esm({
  "src/color-and-light/sketches/sine-wave.sketch.ts"() {
    "use strict";
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
  "color-and-light/sketches/sine-wave": { loader: () => Promise.resolve().then(() => (init_sine_wave_sketch(), sine_wave_sketch_exports)) }
};

// src/_script/sketches.ts
function searchLoader(path) {
  if (path in sketchManifest) {
    return sketchManifest[path].loader;
  }
  return null;
}
async function mountSketch(el) {
  const path = el.getAttribute("data-path");
  if (!path) return;
  const options = JSON.parse(el.getAttribute("data-options") ?? "{}");
  try {
    const loader = searchLoader(path);
    if (!loader) {
      console.error(`[sketch] sketch not found, path: ${path}`);
      return;
    }
    const module = await loader();
    if (typeof module.create !== "function") {
      console.error(`[sketch] create() is not exported: ${name}`);
      return;
    }
    await module.create(el, options);
  } catch (error) {
    console.error(`[sketch] failed to load: ${name}`, error);
  }
}
function initSketches() {
  document.querySelectorAll(".sketch").forEach((el) => {
    void mountSketch(el);
  });
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
