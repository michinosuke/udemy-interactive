import { ClassName } from "./model/class-name.js";
import { queryAndClassFilter } from "./lib/query-and-class-filter.js";
import { Question } from "./model/question.js";
import { clearUdemyUI } from "./lib/clear-udemy-ui.js";

let questions: Question[] = [];

// 初回のみ実行する
const initialize = () => {
  const quizPageContent = document.querySelector("div.quiz-page-content") as Element;
  const questionElements = queryAndClassFilter(quizPageContent, "div", /result-pane--accordion-panel--/);
  const className = new ClassName();
  questions = questionElements.map((element) => new Question({ element, className }));
  clearUdemyUI();
};

// リザルト画面が表示されていないかの監視
setInterval(() => {
  const h2 = document.querySelector("div.quiz-page-content h2[data-purpose='title']") as any;
  if (h2 && h2.dataset.udemyInteractive !== "initialized") {
    h2.dataset.udemyInteractive = "initialized";
    initialize();
  }
}, 300);
