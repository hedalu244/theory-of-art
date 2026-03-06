/**
 * クイズ機能
 * ラジオボタンの選択に応じて正誤判定と解説を表示する
 */
function parseChecklistQuiz(container: HTMLElement): { question: string, options: string[], correctIndex: number, explanation: string } | null {
    const checklist = container.querySelector("ul.checklist");
    if (!checklist) return null;
    const blocks = [...container.children];
    const listIndex = blocks.findIndex(el => el.contains(checklist));
    if (listIndex === -1) return null;

    const question = blocks.slice(0, listIndex).map(el => el.outerHTML).join("");
    const explanation = blocks.slice(listIndex + 1).map(el => el.outerHTML).join("");
    
    const rawOptions = [...checklist.querySelectorAll("li")].map(li => li.innerHTML.trim());
    const options = rawOptions.map(raw => raw.replace(/\s*(?:&#10003;|&#10063;|✓|❏|☐|☑)\s*/, ""));
    const correctIndex = rawOptions.findIndex(raw => /\s*(?:&#10003;|✓)\s*/.test(raw));

    return {
        question,
        options,
        correctIndex,
        explanation
    };
}

function htmlToElment(html: string): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as HTMLElement;
}

function buildQuizHtml(quizId: string, question: string, options: string[], correctIndex: number, explanation: string) {
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

export function initQuizzes() {
    const quizzes = document.querySelectorAll<HTMLElement>('.quiz');

    let quizCounter = 0;

    quizzes.forEach(quiz => {
        quizCounter++;
        const quizId = `quiz-${quizCounter}`;

        const parsedQuiz = parseChecklistQuiz(quiz.children.length == 1 ? quiz.children[0] as HTMLElement : quiz);
        if (!parsedQuiz) {
            console.warn('クイズの解析に失敗しました', quiz);
            return;
        }

        const builtQuiz = buildQuizHtml(quizId, parsedQuiz.question, parsedQuiz.options, parsedQuiz.correctIndex, parsedQuiz.explanation);

        if (!builtQuiz) {
            console.warn('クイズの構築に失敗しました', parsedQuiz);
            return;
        }

        quiz.replaceWith(builtQuiz);

        const correctIndex = parsedQuiz.correctIndex;
        const radioButtons = builtQuiz.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        const feedback = builtQuiz.querySelector<HTMLElement>('.quiz-feedback');
        const explanation = builtQuiz.querySelector<HTMLElement>('.quiz-explanation');

        if (!quizId || correctIndex === -1 || !feedback || !explanation) {
            console.warn('クイズの設定が不完全です', parsedQuiz);
            return;
        }

        radioButtons.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    const isCorrect = index === correctIndex;

                    // フィードバックを表示
                    feedback.style.display = 'block';
                    if (isCorrect) {
                        feedback.textContent = '✓ 正解です！';
                        feedback.className = 'quiz-feedback quiz-feedback-correct';
                    } else {
                        feedback.textContent = '✗ 不正解です';
                        feedback.className = 'quiz-feedback quiz-feedback-incorrect';
                    }

                    // 解説を表示
                    explanation.style.display = 'block';

                    // 全ての選択肢にクラスを追加
                    const allOptions = builtQuiz.querySelectorAll<HTMLElement>('.quiz-option');
                    allOptions.forEach((option, optIndex) => {
                        if (optIndex === correctIndex) {
                            option.classList.add('quiz-option-correct');
                        } else if (optIndex === index && !isCorrect) {
                            option.classList.add('quiz-option-incorrect');
                        } else {
                            option.classList.remove('quiz-option-correct', 'quiz-option-incorrect');
                        }
                    });
                }
            });
        });
    });
}