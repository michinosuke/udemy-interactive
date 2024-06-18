import { queryAndClassFilter } from "./query-and-class-filter.js";

// 不必要な UI を削除する
export const clearUdemyUI = () => {
  [...document.querySelectorAll('span[data-purpose="answer-result-header-user-label"]')].forEach((e) => e.remove());
  queryAndClassFilter(document, "div", /^result-pane--question-header-wrapper--/).forEach((header) => {
    header.querySelector("button")?.remove();
  });
};
