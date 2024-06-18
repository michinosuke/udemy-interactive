import { queryAndClassFilter } from "../lib/query-and-class-filter.js";

// 要素のクラス名の管理
export class ClassName {
  readonly correctChoice: string;
  readonly incorrectChoice: string;

  constructor() {
    this.correctChoice = queryAndClassFilter(
      document,
      'div[data-purpose="answer"]',
      /answer-result-pane--answer-correct--/
    )[0].classList.item(0)!;

    this.incorrectChoice = queryAndClassFilter(
      document,
      'div[data-purpose="answer"]',
      /answer-result-pane--answer-skipped--/
    )[0].classList.item(0)!;
  }
}
