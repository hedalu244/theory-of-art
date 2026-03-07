var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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

// src/pages/3d-LSM-color.sketch.ts
var d_LSM_color_sketch_exports = {};
__export(d_LSM_color_sketch_exports, {
  create: () => create2
});
function create2(el) {
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(600, 600, p.WEBGL);
    };
    p.draw = () => {
      p.background(230);
      p.rotateX(p.millis() / 2e3);
      p.rotateY(p.millis() / 3e3);
      p.stroke(255, 0, 0);
      p.line(-100, 0, 0, 100, 0, 0);
      p.stroke(0, 255, 0);
      p.line(0, -100, 0, 0, 100, 0);
      p.stroke(0, 0, 255);
      p.line(0, 0, -100, 0, 0, 100);
      p.stroke(0);
      p.fill(255, 0, 0, 50);
      p.box(100);
    };
  }, el);
}
var init_d_LSM_color_sketch = __esm({
  "src/pages/3d-LSM-color.sketch.ts"() {
    "use strict";
  }
});

// src/pages/sine-wave.sketch.ts
var sine_wave_sketch_exports = {};
__export(sine_wave_sketch_exports, {
  create: () => create3
});
function create3(el) {
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
  "src/pages/sine-wave.sketch.ts"() {
    "use strict";
  }
});

// src/_script/sketch-manifest.ts
var sketchManifest = {
  "_script/sketches/test-sketch": { loader: () => Promise.resolve().then(() => (init_test_sketch_sketch(), test_sketch_sketch_exports)) },
  "pages/3d-LSM-color": { loader: () => Promise.resolve().then(() => (init_d_LSM_color_sketch(), d_LSM_color_sketch_exports)) },
  "pages/sine-wave": { loader: () => Promise.resolve().then(() => (init_sine_wave_sketch(), sine_wave_sketch_exports)) }
};

// src/_script/sketches.ts
function normalizeManifestKey(pathname) {
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "");
}
function resolvePathWithUrl(path, baseDir) {
  const resolved = new URL(path, `${window.location.origin}${baseDir}`).pathname;
  return normalizeManifestKey(resolved);
}
function searchLoaderByPath(path, baseDir) {
  const resolvedPath = resolvePathWithUrl(path, baseDir);
  if (resolvedPath in sketchManifest) {
    console.log(`[sketch] path found, path: ${path}, resolved: ${resolvedPath}`);
    return sketchManifest[resolvedPath].loader;
  }
  console.log(`[sketch] path not found, path: ${path}, resolved: ${resolvedPath}`);
  return null;
}
function searchLoaderByName(name) {
  const fallbackName = normalizeManifestKey(name).split("/").pop() ?? normalizeManifestKey(name);
  for (const key in sketchManifest) {
    if (key.endsWith(`/${fallbackName}`) || key === fallbackName) {
      console.log(`[sketch] name found: ${name}`);
      return sketchManifest[key].loader;
    }
  }
  console.log(`[sketch] name not found: ${name}`);
  return null;
}
function normalizePath(path) {
  if (path.endsWith("/")) return path;
  if (/\/index\.[^\/\.]*$/.test(path)) return path.replace(/\/index\.[^\/\.]*$/, "/");
  if (/\/[^\/\.]+$/.test(path)) return path + "/";
  return path;
}
async function mountSketch(el) {
  const name = el.getAttribute("data-name");
  if (!name) return;
  const options = el.getAttribute("data-options") ?? void 0;
  const basePath = normalizePath(location.pathname);
  const baseParent = basePath.endsWith("/") ? basePath.replace(/\/[^\/]*\/$/, "/") : basePath.replace(/\/[^\/]*$/, "/");
  try {
    const loader = basePath.endsWith("/") ? searchLoaderByPath(name, baseParent) || searchLoaderByPath(name, basePath) || searchLoaderByName(name) : searchLoaderByPath(name, baseParent) || searchLoaderByName(name);
    if (!loader) {
      console.error(`[sketch] loader not found: ${name}`);
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
