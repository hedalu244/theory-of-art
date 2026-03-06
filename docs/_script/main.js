// src/_script/sketches/test-sketch.ts
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

// src/_script/sketch.ts
function initSketches() {
  const sketches = {
    "test-sketch": create
  };
  document.querySelectorAll(".sketch").forEach((el) => {
    const name = el.getAttribute("data-name");
    if (!name) return;
    const sketch = sketches[name];
    if (!sketch) return;
    sketch(el);
  });
}

// src/_script/quiz.ts
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
