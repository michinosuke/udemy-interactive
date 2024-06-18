import { ClassName } from "./class-name.js";
import { Question } from "./question.js";

export class Choice {
  constructor({ question, element, className }: { question: Question; element: Element; className: ClassName }) {
    this.question = question;
    this.element = element;
    element.classList.add("ui-choice");
    this.checkbox = element.querySelector('div[data-purpose="answer-body"] svg use')!;
    this._isCorrect = element.classList.contains(className.correctChoice!);
    element.classList.remove(className.correctChoice!);
    element.classList.add(className.incorrectChoice!);
  }

  // 親となる問題
  private readonly question: Question;
  getQuestion = () => this.question;

  // 要素
  private readonly element: Element;

  // チェックボックスの SVG 要素
  private readonly checkbox: SVGElement;

  // この選択肢が正解かどうか
  private readonly _isCorrect: boolean;
  isCorrect = () => this._isCorrect;

  // この選択肢が選択されているかどうか
  private _isSelected = false;
  isSelected = () => this._isSelected;

  // チェックボックスアイコンのキー名。正解が１つ→ラジオボタン、正解が複数→チェックボックス
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
    const key = icons[type][+this.isSelected()];
    return key;
  };

  // チェックボックスを描画する
  renderCheckbox = () => {
    this.checkbox.style.color = "rgb(106, 111, 115)";
    this.checkbox.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.checkboxIconKey());
  };

  // 結果のUIを描画する
  showResultUI = () => {
    if (!this.isSelected() && !this.isCorrect()) return;
    if (this.isCorrect()) {
      this.element.classList.add("correct");
    } else {
      this.element.classList.add("incorrect");
    }
  };

  // 結果のUIの描画を消す
  hideResultUI = () => {
    this.element.classList.remove("correct", "incorrect");
  };

  // 選択する
  select = () => {
    this._isSelected = true;
    this.element.classList.add("selected");
    this.renderCheckbox();
  };

  // 選択を解除する
  unselect = () => {
    this._isSelected = false;
    this.element.classList.remove("selected");
    this.renderCheckbox();
  };

  // 選択を切り替える
  toggleSelect = () => {
    this.isSelected() ? this.unselect() : this.select();
  };

  // クリックイベントを追加する
  addClickEvent = (cb: () => void) => {
    this.element.addEventListener("click", cb);
  };

  // mouseenter イベントを追加する
  addMouseEnterEvent = (cb: () => void) => {
    this.element.addEventListener("mouseenter", cb);
  };

  // mouseleave イベントを追加する
  addMouseLeaveEvent = (cb: () => void) => {
    this.element.addEventListener("mouseleave", cb);
  };
}
