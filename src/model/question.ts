import { queryAndClassFilter } from "../lib/query-and-class-filter.js";
import { Choice } from "./choice.js";
import { ClassName } from "./class-name.js";

// ユーザの回答状況
type AnswerState = "NOT_ANSWERED" | "CORRECT" | "INCORRECT";

export class Question {
  constructor({ element, className }: { element: Element; className: ClassName }) {
    this.element = element;

    element.classList.add("ui-question");

    this.choices = queryAndClassFilter(element, 'div[data-purpose="answer"]', /^answer-result-pane--/).map(
      (choiceElement) => new Choice({ question: this, element: choiceElement, className })
    );

    this.choices.forEach((choice) => choice.renderCheckbox());
    this.updateQuestionIcon("NOT_ANSWERED");
    this.updateHeaderStatus("NOT_ANSWERED");

    this.explanation =
      queryAndClassFilter(element, "div", /overall-explanation-pane--overall-explanation--/)[0] ??
      document.createElement("div");

    this.addMouseEnterEvent();
    this.addMouseLeaveEvent();
    this.addClickEvent();

    this.shrink();
  }

  private readonly element: Element;
  private readonly choices: Choice[];
  private readonly explanation: Element;

  // 問題の上のところにあるアイコンを answerState に合わせて更新する
  private updateQuestionIcon = (answerState: AnswerState) => {
    const icon = queryAndClassFilter(this.element, "span", /^result-pane--question-icon-background--/)[0];
    const use = icon.querySelector("use");
    if (!use) throw new Error();
    const iconKey = (() => {
      if (answerState === "CORRECT") return "#icon-success";
      if (answerState === "INCORRECT") return "#icon-error";
      return "#icon-close";
    })();
    const color = (() => {
      if (answerState === "CORRECT") return "rgb(25, 163, 140)";
      if (answerState === "INCORRECT") return "rgb(244, 82, 45)";
      return "rgb(157, 163, 167)";
    })();
    const backgroundColor = (() => {
      if (answerState === "CORRECT") return "rgb(247, 249, 250)";
      if (answerState === "INCORRECT") return "rgb(247, 249, 250)";
      return "rgb(157, 163, 167)";
    })();
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", iconKey);
    use.style.color = color;
    use.parentElement!.parentElement!.style.background = backgroundColor;
  };

  // 問題の上のところにあるステータスを answerState に合わせて更新する
  private updateHeaderStatus = (answerState: AnswerState) => {
    const span = this.element.querySelector<HTMLSpanElement>(
      'span[data-purpose="question-result-header-status-label"]'
    );
    if (!span) throw new Error();
    const text = (() => {
      if (answerState === "CORRECT") return "正解";
      if (answerState === "INCORRECT") return "不正解";
      return "未回答";
    })();
    const rgb = (() => {
      if (answerState === "CORRECT") return "rgb(30, 96, 85)";
      if (answerState === "INCORRECT") return "rgb(179, 45, 15)";
      return "rgb(157, 163, 167)";
    })();
    span.innerHTML = text;
    span.style.color = rgb;
  };

  // 正解の選択肢の数
  correctCount = (): number => this.choices?.filter((choice) => choice.isCorrect()).length;

  // 選択済の選択肢の数
  selectedCount = (): number => this.choices?.filter((choice) => choice.isSelected()).length;

  // 説明が表示されているべきかどうか
  shouldExpanded = (): boolean => this.correctCount() <= this.selectedCount();

  // 説明を表示する
  expand = () => {
    this.explanation.classList.remove("display-none");
    this.explanation.classList.add("display-active");
    const hasIncorrect = !!this.choices.find((choice) => choice.isCorrect() === false && choice.isSelected() === true);
    const answerState: AnswerState = hasIncorrect ? "INCORRECT" : "CORRECT";
    this.updateQuestionIcon(answerState);
    this.updateHeaderStatus(answerState);
    this.choices.forEach((choice) => choice.showResultUI());
  };

  // 説明を非表示にする
  shrink = () => {
    this.explanation.classList.add("display-none");
    this.explanation.classList.remove("display-active");
    this.choices.forEach((choice) => {
      choice.unselect();
      choice.hideResultUI();
    });
  };

  // click イベントの追加
  addClickEvent = () => {
    this.choices.forEach((choice) => {
      choice.addClickEvent(() => {
        // すでに展開されている問題の場合は、縮小だけする
        if (choice.getQuestion().shouldExpanded()) {
          choice.getQuestion().shrink();
          return;
        }

        choice.toggleSelect();

        if (choice.getQuestion().shouldExpanded()) {
          choice.getQuestion().expand();
        }
      });
    });
  };

  // mouse enter イベントの追加
  addMouseEnterEvent = () => {
    this.choices.forEach((choice) =>
      choice.addMouseEnterEvent(() => {
        // console.log("enter", choice);
      })
    );
  };

  // mouse leave イベントの追加
  addMouseLeaveEvent = () => {
    this.choices.forEach((choice) =>
      choice.addMouseLeaveEvent(() => {
        // console.log("leave", choice);
      })
    );
  };
}
