let className: {
  correctChoice?: string;
  incorrectChoice?: string;
} = {};

type AnswerState = "NOT_ANSWERED" | "CORRECT" | "INCORRECT";

class Choice {
  constructor({ question, element }: { question: Question; element: Element }) {
    this.question = question;
    this._element = element;
    element.classList.add("ui-choice");
    this._checkbox = element.querySelector('div[data-purpose="answer-body"] svg use')!;
    this._isCorrect = element.classList.contains(className.correctChoice!);
    element.classList.remove(className.correctChoice!);
    element.classList.add(className.incorrectChoice!);
  }

  question: Question;
  private _element: Element;
  private _checkbox: SVGElement;
  private _isCorrect = false;
  private _isSelected = false;

  private checkboxIconKey = (): string => {
    const icons: { [K in "single" | "multiple"]: { [N: number]: string } } = {
      single: {
        0: "#icon-radio-empty",
        1: "#icon-radio-filled",
      },
      multiple: {
        0: "#icon-checkbox-empty",
        1: "#icon-checkbox-filled",
      },
    };
    const type = this.question.correctCount() > 1 ? "multiple" : "single";
    const key = icons[type][+this._isSelected];
    return key;
  };

  updateCheckbox = () => {
    this._checkbox.style.color = "rgb(106, 111, 115)";
    this._checkbox.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.checkboxIconKey());
  };

  showResultUI = () => {
    if (!this.isSelected() && !this.isCorrect()) return;
    if (this.isCorrect()) {
      this._element.classList.add("correct");
    } else {
      this._element.classList.add("incorrect");
    }
  };

  hideResultUI = () => {
    this._element.classList.remove("correct", "incorrect");
  };

  select = () => {
    this._isSelected = true;
    this._element.classList.add("selected");
    this.updateCheckbox();
  };

  unselect = () => {
    this._isSelected = false;
    this._element.classList.remove("selected");
    this.updateCheckbox();
  };

  toggleSelect = () => {
    this._isSelected ? this.unselect() : this.select();
  };

  private _UIClassName = () => (this._isCorrect ? "ui-correct" : "ui-incorrect");

  addClickEvent = (cb: () => void) => {
    this._element.addEventListener("click", cb);
  };

  addMouseEnterEvent = (cb: () => void) => {
    this._element.addEventListener("mouseenter", cb);
  };

  addMouseLeaveEvent = (cb: () => void) => {
    this._element.addEventListener("mouseleave", cb);
  };

  isSelected = () => this._isSelected;

  isCorrect = () => this._isCorrect;
}

class Question {
  constructor({ element }: { element: Element }) {
    this._element = element;

    element.classList.add("ui-question");

    this._choices = queryAndClassFilter(element, 'div[data-purpose="answer"]', /^answer-result-pane--/).map(
      (choiceElement) => new Choice({ question: this, element: choiceElement })
    );

    this._choices.forEach((choice) => choice.updateCheckbox());
    this.updateQuestionIcon("NOT_ANSWERED");
    this.updateHeaderStatus("NOT_ANSWERED");

    this._explanation =
      queryAndClassFilter(element, "div", /overall-explanation-pane--overall-explanation--/)[0] ??
      document.createElement("div");

    this.addMouseEnterEvent();
    this.addMouseLeaveEvent();
    this.addClickEvent();

    this.shrink();
  }

  private _element: Element;
  private _choices: Choice[];
  private _explanation: Element;

  private updateQuestionIcon = (answerState: AnswerState) => {
    const icon = queryAndClassFilter(this._element, "span", /^result-pane--question-icon-background--/)[0];
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

  private updateHeaderStatus = (answerState: AnswerState) => {
    const span = this._element.querySelector<HTMLSpanElement>(
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

  onClickShrinkIcon = () => {};

  correctCount = (): number => this._choices?.filter((choice) => choice.isCorrect()).length;
  selectedCount = (): number => this._choices?.filter((choice) => choice.isSelected()).length;
  shouldExpanded = (): boolean => this.correctCount() <= this.selectedCount();
  expand = () => {
    this._explanation.classList.remove("display-none");
    this._explanation.classList.add("display-active");
    const hasIncorrect = !!this._choices.find((choice) => choice.isCorrect() === false && choice.isSelected() === true);
    const answerState: AnswerState = hasIncorrect ? "INCORRECT" : "CORRECT";
    this.updateQuestionIcon(answerState);
    this.updateHeaderStatus(answerState);
    this._choices.forEach((choice) => choice.showResultUI());
  };
  shrink = () => {
    this._explanation.classList.add("display-none");
    this._explanation.classList.remove("display-active");
    this._choices.forEach((choice) => {
      choice.unselect();
      choice.hideResultUI();
    });
  };
  addClickEvent = () => {
    this._choices.forEach((choice) => {
      choice.addClickEvent(() => {
        // すでに展開されている問題の場合は、縮小だけする
        if (choice.question.shouldExpanded()) {
          choice.question.shrink();
          return;
        }

        choice.toggleSelect();

        if (choice.question.shouldExpanded()) {
          choice.question.expand();
        }
      });
    });
  };
  addMouseEnterEvent = () => {
    this._choices.forEach((choice) =>
      choice.addMouseEnterEvent(() => {
        // console.log("enter", choice);
      })
    );
  };
  addMouseLeaveEvent = () => {
    this._choices.forEach((choice) =>
      choice.addMouseLeaveEvent(() => {
        // console.log("leave", choice);
      })
    );
  };
}

let questions: Question[] = [];

// type Mode = "SEITO_NOMI" | "ICHIMON_ITTO";

// const mode = (): { value: Mode; setMode: (mode: Mode) => void } => {
//   let value: Mode = "ICHIMON_ITTO";
//   return {
//     value,
//     setMode: (mode: Mode) => {
//       value = mode;
//     },
//   };
// };

// const errorCode = (): { add: (code: number) => void; print: () => void } => {
//   const codes = new Set<number>();
//   return {
//     add: (code: number) => codes.add(code),
//     print: () => console.log([...codes].join("\n")),
//   };
// };

const queryAndClassFilter = (parent: Element | Document, query: string, className: RegExp): Element[] => {
  return [...parent.querySelectorAll(query)].filter((e) => e.className.match(className));
};

const resetUdemyUI = () => {
  [...document.querySelectorAll('span[data-purpose="answer-result-header-user-label"]')].forEach((e) => e.remove());
  queryAndClassFilter(document, "div", /^result-pane--question-header-wrapper--/).forEach((header) => {
    header.querySelector("button")?.remove();
  });
};

// クラス名を取得
const prepareClassName = () => {
  className.correctChoice = queryAndClassFilter(
    document,
    'div[data-purpose="answer"]',
    /answer-result-pane--answer-correct--/
  )[0].classList.item(0)!;

  className.incorrectChoice = queryAndClassFilter(
    document,
    'div[data-purpose="answer"]',
    /answer-result-pane--answer-skipped--/
  )[0].classList.item(0)!;
};

// 初回のみ実行する
const initialize = () => {
  prepareClassName();
  const quizPageContent = document.querySelector("div.quiz-page-content") as Element;
  const questionElements = queryAndClassFilter(quizPageContent, "div", /result-pane--accordion-panel--/);
  questions = questionElements.map((element) => new Question({ element }));
  resetUdemyUI();
};

const waitAppearQuestionsId = setInterval(() => {
  const h2 = document.querySelector("div.quiz-page-content h2[data-purpose='title']") as any;
  if (h2 && h2.dataset.udemyInteractive !== "initialized") {
    h2.dataset.udemyInteractive = "initialized";
    initialize();
  }
}, 300);
