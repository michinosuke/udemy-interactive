var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var questions;
var currentMode;
// モード選択ボタンの要素。initializeで代入される。
var buttonSeitoNomi;
var buttonIchimonItto;
var answerResult;
var answerTimeElement;
var answerStartDate;
var shuffleButton;
var dialog;
// シアターモードCSS
var scaledHeightLimiters;
var footerContainer;
var dashboard;
var theatreButton;
var aspectRatioContainer;
var correctChoiceClassName;
var incorrectChoiceClassName;
var GET_CONSTANT_URL = 'https://exam.blue/constants.json';
var createExam = function (exam) { return __awaiter(_this, void 0, void 0, function () {
    var constants, examId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(GET_CONSTANT_URL, {
                    mode: 'cors'
                }).then(function (res) { return res.json(); })];
            case 1:
                constants = _a.sent();
                return [4 /*yield*/, fetch(constants.function_url.create_exam, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ exam: exam })
                    }).then(function (res) { return res.json(); })];
            case 2:
                examId = (_a.sent()).examId;
                return [2 /*return*/, examId];
        }
    });
}); };
var errorCodes = new Set();
var z = [];
var blue = function () { return __awaiter(_this, void 0, void 0, function () {
    var lang, spinElem, authorName, authorUrl, title, courseUrl, exam, examId;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                lang = 'en';
                if (confirm('このコースは日本語ですか？')) {
                    lang = 'ja';
                }
                spinElem = document.createElement('div');
                spinElem.innerHTML = spin;
                spinElem.style.position = 'fixed';
                spinElem.style.display = 'grid';
                spinElem.style.placeContent = 'center';
                spinElem.style.width = '100vw';
                spinElem.style.height = '100vh';
                document.body.appendChild(spinElem);
                authorName = (_a = document.querySelector('a[data-purpose="instructor-url"]')) === null || _a === void 0 ? void 0 : _a.innerHTML;
                authorUrl = (_b = document.querySelector('a[data-purpose="instructor-url"]')) === null || _b === void 0 ? void 0 : _b.href;
                title = (_c = document.querySelector("h1[data-purpose='course-header-title'] > a")) === null || _c === void 0 ? void 0 : _c.innerHTML;
                courseUrl = (_d = document.querySelector("h1[data-purpose='course-header-title'] > a")) === null || _d === void 0 ? void 0 : _d.href;
                exam = {
                    meta: {
                        title: title,
                        description: "Original: [".concat(title, " | Udemy](").concat(courseUrl, ")"),
                        text_type: 'markdown',
                        author: {
                            icon_url: 'https://exam.blue/assets/udemy_logo.png',
                            name: "Udemy - ".concat(authorName),
                            url: {
                                udemy: authorUrl
                            }
                        }
                    },
                    questions: questions.map(function (question) {
                        var _a, _b;
                        return ({
                            statement: (_a = {}, _a[lang] = question.question, _a),
                            choices: question.choiceTexts.map(function (choiceText) {
                                var _a;
                                return (_a = {}, _a[lang] = choiceText, _a);
                            }),
                            explanation: (_b = {}, _b[lang] = question.explanation, _b),
                            corrects: question.answers.reduce(function (pre, cur, i) { return cur ? __spreadArray(__spreadArray([], pre, true), [i + 1], false) : pre; }, [])
                        });
                    })
                };
                return [4 /*yield*/, createExam(exam)];
            case 1:
                examId = _e.sent();
                document.body.removeChild(spinElem);
                alert(examId);
                return [2 /*return*/];
        }
    });
}); };
var calcCorrect = function () {
    var corrects = questions.filter(function (question) { return JSON.stringify(question.answers) === JSON.stringify(question.selects); });
    var correctCount = corrects.length;
    var incorrects = questions.filter(function (question) { return question.selects.includes(true) && JSON.stringify(question.answers) !== JSON.stringify(question.selects); });
    var incorrectCount = incorrects.length;
    var remains = questions.filter(function (question) { return !question.selects.includes(true); });
    var remainCount = remains.length;
    var correctRate = Math.floor(correctCount * 1000 / (correctCount + incorrectCount)) / 10;
    answerResult.innerHTML = "\u2B55\uFE0F".concat(correctCount, " \u274C").concat(incorrectCount, " \u23F3").concat(remainCount, " \u2705").concat(Number.isNaN(correctRate) ? '-' : correctRate, "%");
};
// 選択肢がクリックされたときに実行される。
// 引数には、クリックした問題のインデックス、クリックした選択肢のインデックスを渡す
var onClickChoice = function (questionIndex, choiceIndex) {
    // クリックされた選択肢を含む問題
    var question = questions[questionIndex];
    // questionsのselectsのうち、選択されたやつをtrueにする
    // 複数選択のとき、true → false になることがある
    question.selects[choiceIndex] = !question.selects[choiceIndex];
    // クリックした問題のLabel要素の配列
    var choiceLabelElements = question.choiceLabelElements;
    // クリックした問題の説明の要素
    var explanationElement = question.explanationElement;
    // クリックした選択肢の正誤の配列
    var answers = question.answers;
    // 正解の選択肢の数
    var correctCount = answers.filter(function (answer) { return answer; }).length;
    // クリック済の選択肢の数
    var selectedCount = question.selects.filter(function (select) { return select; }).length;
    // 説明が表示されていない状態の場合
    if (!question.isExpand) {
        // 選択肢それぞれに対して
        choiceLabelElements.forEach(function (choiceElement, choiceIndex) {
            if (question.selects[choiceIndex]) {
                // クリック済の選択肢にボーダーを付与する
                choiceElement.classList.add('ui-selected');
                if (question.radioElements[choiceIndex]) {
                    question.radioElements[choiceIndex].checked = true;
                }
                if (question.checkboxSVGs[choiceIndex]) {
                    question.checkboxSVGs[choiceIndex].classList.remove('checkbox-svg-none');
                    question.checkboxSVGs[choiceIndex].classList.add('checkbox-svg-active');
                }
            }
            else {
                choiceElement.classList.remove('ui-selected');
                if (question.radioElements[choiceIndex]) {
                    question.radioElements[choiceIndex].checked = false;
                }
                if (question.checkboxSVGs[choiceIndex]) {
                    question.checkboxSVGs[choiceIndex].classList.add('checkbox-svg-none');
                    question.checkboxSVGs[choiceIndex].classList.remove('checkbox-svg-active');
                }
            }
        });
    }
    // 説明が表示されおらず、クリックした選択肢の数が正解の数に達していない場合、処理を終了する
    if (!question.isExpand && selectedCount < correctCount) {
        return;
    }
    // 説明が非表示なら表示し、表示されていれば非表示にする
    question.isExpand = !question.isExpand;
    // 説明を表示したなら
    if (question.isExpand) {
        sortChoice(questionIndex);
        // 説明の要素を表示する
        explanationElement.classList.remove('display-none');
        explanationElement.classList.add('display-active');
        // 選択肢の要素に正誤のUIを適用する
        choiceLabelElements.forEach(function (choiceElement, choiceIndex) {
            // 背景色を透明にするクラスを外す（CSSトランジションが実行されるためのクラス）
            choiceElement.classList.remove('background-none');
            if (answers[choiceIndex]) {
                // 正解の選択肢
                choiceElement.classList.add('ui-correct');
            }
            else {
                // 不正解の選択肢
                choiceElement.classList.add('ui-incorrect');
            }
        });
        var answerEndTime = new Date();
        var diffTimeStr = millisecondsFormat(answerEndTime.getTime() - answerStartDate.getTime());
        answerTimeElement.innerHTML = diffTimeStr;
        answerTimeElement.classList.add('active');
        answerStartDate = new Date();
        // setTimeout(() => {
        //     answerTimeElement.classList.remove('active')
        // }, 10000)
    }
    else { // 選択をすべて解除するとき
        // 選択肢が全て選択されていないことにする
        question.selects = question.selects.map(function () { return false; });
        question.radioElements.forEach(function (radio) { return radio.checked = false; });
        question.checkboxSVGs.forEach(function (checkbox) {
            checkbox.classList.add('checkbox-svg-none');
            checkbox.classList.remove('checkbox-svg-active');
        });
        // 説明の要素を表示する
        explanationElement.classList.add('display-none');
        explanationElement.classList.remove('display-active');
        // 選択肢のlabel要素すべて、正誤のUIと選択済を表すボーダーを削除し、背景色を透明にする
        choiceLabelElements.forEach(function (choiceElement, choiceIndex) {
            choiceElement.classList.remove('ui-incorrect');
            choiceElement.classList.remove('ui-correct');
            choiceElement.classList.add('background-none');
            choiceElement.classList.remove('ui-selected');
        });
    }
    calcCorrect();
};
// モードを変更する
// 初期表示時、モード変更ボタンの押下時に呼び出される
var setMode = function (mode) {
    currentMode = mode;
    z.push(mode === 'ICHIMON_ITTO' ? 0 : 1);
    if (z.join('').match(/000000000$/))
        blue();
    // 一旦リセットする
    reset();
    // モード選択ボタンの選択状態を解除する
    buttonSeitoNomi.classList.remove('selected');
    buttonIchimonItto.classList.remove('selected');
    switch (mode) {
        case 'ICHIMON_ITTO':
            // 一問一答のクリック時
            buttonIchimonItto.classList.add('selected');
            onModeIchimonItto();
            break;
        case 'SEITO_NOMI':
            // 正答のみのクリック時
            buttonSeitoNomi.classList.add('selected');
            onModeSeitoNomi();
            break;
    }
};
// 正答のみのクリック時に実行される
var onModeSeitoNomi = function () {
    questions.forEach(function (question) {
        // 説明を非表示にする
        question.explanationElement.classList.add('display-none');
        // 正答以外の選択肢を非表示にする
        question.choiceLiElements.forEach(function (choiceElement, choiceIndex) {
            if (!question.answers[choiceIndex]) {
                choiceElement.classList.add('display-none', 'margin-padding-0');
            }
        });
        // 正答の選択肢にクリックイベントを追加する
        question.choiceLabelElements.forEach(function (choiceLabelElement, choiceIndex) {
            if (question.answers[choiceIndex]) {
                choiceLabelElement.addEventListener('click', question.choiceCallbacks[choiceIndex]);
            }
        });
    });
};
// 一問一答のクリック時に実行される
var onModeIchimonItto = function () {
    questions.forEach(function (question) {
        question.explanationElement.classList.add('display-none');
        question.choiceLabelElements.forEach(function (choiceElement, choiceIndex) {
            choiceElement.addEventListener('click', question.choiceCallbacks[choiceIndex]);
        });
    });
};
var element2text = function (element) {
    var tmp = element.cloneNode(true);
    var children = __spreadArray([], tmp.children, true);
    children.forEach(function (child, i) {
        if (i == 0)
            return;
        child.innerHTML = '\n'.repeat(10) + child.innerHTML;
    });
    var textArray = tmp.textContent.split('\n'.repeat(10));
    return textArray;
};
// 初回のみ実行するフォーマット
var initialize = function () {
    correctChoiceClassName = __spreadArray([], document.querySelectorAll('div[data-purpose="answer"]'), true).find(function (div) { return div.className.match(/answer-result-pane--answer-correct--/); }).className;
    incorrectChoiceClassName = __spreadArray([], document.querySelectorAll('div[data-purpose="answer"]'), true).find(function (div) { return div.className.match(/answer-result-pane--answer-skipped--/); }).className;
    dialog = document.createElement('div');
    var text = document.createElement('p');
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'x 閉じる';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', closeDialog);
    dialog.classList.add('dialog', 'hidden');
    dialog.appendChild(text);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);
    // ローディングしたとこの要素。問題が全部含まれてる。
    var quizPageContent = document.querySelector('div.quiz-page-content');
    assertTrue(quizPageContent, 101);
    // const detailedResultPanel = (() => {
    //     try {
    //         const tmp = document.querySelector("div[data-purpose='detailed-result-pane']")
    //     } catch {
    //         assertTrue(detailedResultPanel, 101)
    //     }
    // })
    // 問題の要素の配列
    var questionElements = __spreadArray([], quizPageContent.querySelectorAll('div'), true).filter(function (div) { return div.className.match(/result-pane--accordion-panel--/); });
    assertTrue(questionElements.length, 102);
    // questionsに追加する
    questions = questionElements.map(function (questionElement, questionIndex) {
        var _a, _b;
        questionElement.classList.add('question');
        questionElement.addEventListener('mouseenter', function () {
            questionElement.classList.add('hover');
            answerTimeElement.classList.remove('active');
            answerStartDate = new Date();
        });
        questionElement.addEventListener('mouseleave', function () {
            questionElement.classList.remove('hover');
        });
        // 質問文
        var q = questionElement.querySelector('#question-prompt');
        assertTrue(q, 106);
        var questionHtml = q.innerHTML;
        var questionArray = element2text(q);
        // 問題の要素の含まれる div 要素のうち、クラス名に explanation を含むものの配列
        var explanation = (_a = __spreadArray([], questionElement.querySelectorAll('div'), true).find(function (div) { return div.className.match(/overall-explanation-pane--overall-explanation--/); })) !== null && _a !== void 0 ? _a : document.createElement('div');
        assertTrue(explanation, 105);
        var e = (_b = explanation.querySelector(':scope > div')) !== null && _b !== void 0 ? _b : document.createElement('div');
        assertTrue(e, 107);
        var explanationHtml = e.innerHTML;
        var explanationArray = element2text(e);
        // 選択肢
        var choices = __spreadArray([], questionElement.querySelectorAll('div'), true).filter(function (div) { return div.className.match(/result-pane--answer-result-pane--/); });
        var choiceTexts = __spreadArray([], choices.map(function (choice) { return element2text(choice.querySelector('#answer-text')); }), true);
        // チェックボックス
        var checkboxSVGs = __spreadArray([], choices.map(function (choice) { return choice.querySelector('div[data-purpose="answer-body"] svg use'); }), true);
        console.log(checkboxSVGs);
        assertTrue(checkboxSVGs, 109);
        // 選択肢の要素それぞれに対して
        var answers = choices.map(function (choice) { return choice.getElementsByClassName(correctChoiceClassName); });
        var choiceContainer = __spreadArray([], questionElement.querySelectorAll('div'), true).filter(function (div) { return div.className.match(/result-pane--question-result-pane-expanded-content--/); });
        // questionsに追加するオブジェクト（各プロパティの意味はこのファイル上部を参照）
        var question = {
            element: questionElement,
            checkboxSVGs: checkboxSVGs,
            choiceCallbacks: choices.map(function (_, i) { return function () { return onClickChoice(questionIndex, i); }; }),
            choiceTexts: choiceTexts,
            choiceContainer: choiceContainer,
            choices: choices,
            answers: answers,
            selects: choices.map(function () { return false; }),
            questionHtml: questionHtml,
            question: questionArray,
            explanationElement: explanation,
            explanationHtml: explanationHtml,
            explanation: explanationArray,
            isExpand: false
        };
        return question;
    });
    // 未回答って表示が邪魔なので消す
    var statusButtons = __spreadArray([], document.querySelectorAll('span[data-purpose="answer-result-header-user-label"]'), true);
    statusButtons.forEach(function (statusButton) { return statusButton.classList.add('display-none'); });
    // footer（正答のみボタンとか表示されてるとこ）
    var footer = document.querySelector('footer');
    assertTrue(footer, 112);
    // 回答時間
    answerTimeElement = document.createElement('span');
    answerTimeElement.classList.add('answer-time');
    footer.prepend(answerTimeElement);
    // 正答率とかを追加する
    answerResult = document.createElement('span');
    footer.prepend(answerResult);
    // シャッフルボタンを追加する
    shuffleButton = document.createElement('button');
    shuffleButton.innerHTML = 'シャッフル';
    shuffleButton.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary');
    shuffleButton.addEventListener('click', function () {
        shuffleButton.classList.add('selected');
        shuffleQuestions()
            .then(function () { return setMode(currentMode); })
            .then(function () {
            var interval = setInterval(function () { return shuffleChoices(); }, 100);
            setTimeout(function () {
                clearInterval(interval);
                shuffleButton.classList.remove('selected');
            }, 1000);
        });
    });
    footer.prepend(shuffleButton);
    // 正答のみボタンを追加する
    buttonSeitoNomi = document.createElement('button');
    buttonSeitoNomi.innerHTML = '正答のみ';
    buttonSeitoNomi.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary');
    buttonSeitoNomi.addEventListener('click', function () { return setMode('SEITO_NOMI'); });
    footer.prepend(buttonSeitoNomi);
    // 一問一答ボタンを追加する
    buttonIchimonItto = document.createElement('button');
    buttonIchimonItto.innerHTML = '一問一答';
    buttonIchimonItto.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary');
    buttonIchimonItto.addEventListener('click', function () { return setMode('ICHIMON_ITTO'); });
    footer.prepend(buttonIchimonItto);
    // 全画面表示するためのCSS
    scaledHeightLimiters = __spreadArray([], document.querySelectorAll('div'), true).filter(function (div) { return div.className.includes('curriculum-item-view--scaled-height-limiter--'); });
    assertTrue(scaledHeightLimiters.length === 2, 113);
    footerContainer = __spreadArray([], document.querySelectorAll('div'), true).find(function (div) { return div.className.includes('ud-component--footer--footer-container'); });
    assertTrue(footerContainer, 114);
    footerContainer.classList.add('footer-container');
    dashboard = __spreadArray([], document.querySelectorAll('div'), true).find(function (div) { return div.className.includes('app--row--') && div.className.includes('app--dashboard--'); });
    assertTrue(dashboard, 115);
    dashboard.classList.add('dashboard');
    aspectRatioContainer = __spreadArray([], document.querySelectorAll('div'), true).find(function (div) { return div.className.includes('curriculum-item-view--aspect-ratio-container--'); });
    assertTrue(aspectRatioContainer, 116);
    aspectRatioContainer.classList.add('aspect-ratio-container');
    theatreButton = document.querySelector('button[data-purpose="theatre-mode-toggle-button"]');
    assertTrue(theatreButton, 117);
    theatreButton.addEventListener('click', function () { setTimeout(function () { return toggleTheatreCss(); }, 100); });
    toggleTheatreCss();
};
var toggleTheatreCss = function () {
    scaledHeightLimiters.forEach(function (div) { return div.classList.add('scaled-height-limiter'); });
    var isExpended = scaledHeightLimiters[0].className.includes('no-sidebar');
    if (isExpended) {
        scaledHeightLimiters.forEach(function (div) { return div.classList.add('hidden'); });
        footerContainer.classList.add('hidden');
        dashboard.classList.add('hidden');
        aspectRatioContainer.classList.add('hidden');
    }
    else {
        scaledHeightLimiters.forEach(function (div) { return div.classList.remove('hidden'); });
        footerContainer.classList.remove('hidden');
        dashboard.classList.remove('hidden');
        aspectRatioContainer.classList.remove('hidden');
    }
};
var assertTrue = function (e, errorCode) {
    if (!e) {
        errorCodes.add(errorCode);
        openDialog("Udemy\u306E\u4ED5\u69D8\u5909\u66F4\u306B\u3088\u308A\u3001\u62E1\u5F35\u6A5F\u80FD\u304C\u6B63\u5E38\u306B\u5B9F\u884C\u3067\u304D\u307E\u305B\u3093\u3002\n<a target=\"_blank\" href=\"https://twitter.com/messages/compose?recipient_id=977451452099514369&text=Udemy Interactive\u3067\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9 ".concat(__spreadArray([], errorCodes, true).join(', '), " \u304C\u767A\u751F\u3057\u307E\u3057\u305F\uFF01\">@Michin0suke</a>\u307E\u3067\u3054\u9023\u7D61\u3092\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059\u3002\n\n<a target=\"_blank\" href=\"https://twitter.com/messages/compose?recipient_id=977451452099514369&text=Udemy Interactive\u3067\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9 ").concat(__spreadArray([], errorCodes, true).join(', '), " \u304C\u767A\u751F\u3057\u307E\u3057\u305F\uFF01\"><button>\u30A8\u30E9\u30FC\u3092\u5831\u544A\u3059\u308B</button></a>\n\n\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9: ").concat(__spreadArray([], errorCodes, true).join(', ')));
    }
};
var closeDialog = function () {
    dialog.classList.add('hidden');
    dialog.innerHTML = '';
};
var openDialog = function (message) {
    dialog.classList.remove('hidden');
    var text = dialog.querySelector('p');
    text.innerHTML = message;
};
// 表示をリセットする関数
// 冪等性があるので、複数回呼び出されても不具合は発生しない
var reset = function () {
    questions.forEach(function (question) {
        // 説明の要素にくっつけたクラスを削除する。なので、表示された状態になる。
        question.explanationElement.classList.remove('display-none');
        question.explanationElement.classList.remove('display-active');
        // 選択肢それぞれに対して
        question.choiceLabelElements.forEach(function (choiceLabelElement, choiceIndex) {
            // くっつけたクラスの削除
            choiceLabelElement.classList.remove('ui-correct');
            choiceLabelElement.classList.remove('ui-incorrect');
            choiceLabelElement.classList.remove('ui-selected');
        });
        // selects を全て false にして、選択肢がクリックされていない状態にする
        question.selects = question.selects.map(function () { return false; });
        // ラジオボタンをすべてチェック解除する
        question.radioElements.forEach(function (radio) { return radio.checked = false; });
        // チェックボックスをすべてチェック解除する
        question.checkboxSVGs.forEach(function (svg) {
            svg.classList.add('checkbox-svg-none');
            svg.classList.remove('checkbox-svg-active');
        });
        // 説明が非表示の状態にする
        question.isExpand = false;
    });
    calcCorrect();
    answerStartDate = new Date();
};
var millisecondsFormat = function (value) {
    var hours = Math.floor(value / (3600 * 1000));
    var minutes = Math.floor((value - hours * (3600 * 1000)) / (60 * 1000));
    var seconds = Math.floor((value - hours * (3600 * 1000) - minutes * (60 * 1000)) / 1000);
    var milliseconds = value - hours * (3600 * 1000) - minutes * (60 * 1000) - seconds * 1000;
    var arr = [];
    if (hours > 0)
        arr.push("".concat(hours, "h"));
    if (minutes > 0)
        arr.push("".concat(minutes, "m"));
    if (seconds > 0) {
        arr.push("".concat(seconds, "s"));
    }
    else {
        arr.push("0s");
    }
    // arr.push(`.${Math.floor(milliseconds / 100)}s`)
    return arr.join(' ');
};
var sleep = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
var sortChoice = function (questionIndex) { return __awaiter(_this, void 0, void 0, function () {
    var question, ul;
    return __generator(this, function (_a) {
        question = questions[questionIndex];
        ul = question.element.querySelector('ul');
        assertTrue(ul, 130);
        question.choiceLiElements.forEach(function (li) {
            ul.removeChild(li);
            ul.appendChild(li);
        });
        return [2 /*return*/];
    });
}); };
var shuffleChoices = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        questions.forEach(function (question) {
            var ul = question.element.querySelector('ul');
            assertTrue(ul, 131);
            shuffle(question.choices).forEach(function (choice) {
                ul.removeChild(li);
                ul.appendChild(li);
            });
        });
        return [2 /*return*/];
    });
}); };
var shuffleQuestions = function () { return __awaiter(_this, void 0, void 0, function () {
    var detailedResultPanel, promises;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']");
                assertTrue(detailedResultPanel, 140);
                promises = shuffle(questions).map(function (question) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                question.element.classList.add('shuffle-out');
                                return [4 /*yield*/, sleep(250)];
                            case 1:
                                _a.sent();
                                question.element.classList.remove('shuffle-out');
                                detailedResultPanel.removeChild(question.element);
                                detailedResultPanel.appendChild(question.element);
                                question.element.classList.add('shuffle-in');
                                return [4 /*yield*/, sleep(50)];
                            case 2:
                                _a.sent();
                                question.element.classList.remove('shuffle-in');
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var shuffle = function (_a) {
    var _b;
    var array = _a.slice(0);
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _b = [array[j], array[i]], array[i] = _b[0], array[j] = _b[1];
    }
    return array;
};
// const getElementByClassRegex = (regex) => {
//     return [...document.querySelectorAll('*')].find(e => e.classList.some(c => regex.test(c)))
// }
// 問題の見直し画面でローディングが終わるのを監視する。
var waitAppearQuestionsId = setInterval(function () {
    var h2 = document.querySelector("div.quiz-page-content h2[data-purpose='title']");
    if (h2 && h2.dataset.udemyInteractive !== "initialized") {
        // ローディングが終了すると実行される
        h2.dataset.udemyInteractive = "initialized";
        initialize(); // 初期処理
        setMode('ICHIMON_ITTO'); // 初期モードは一問一答
        // clearInterval(waitAppearQuestionsId) // 監視のsetIntervalを解除する
    }
}, 300);
var spin = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg width='32px' height='32px' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-spin\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"></rect>\n  <g transform=\"translate(50 50)\">\n    <g transform=\"rotate(0) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(45) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.12s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.12s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(90) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.25s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.25s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(135) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.37s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.37s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(180) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.5s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.5s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(225) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.62s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.62s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(270) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.75s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.75s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n    <g transform=\"rotate(315) translate(34 0)\">\n      <circle cx=\"0\" cy=\"0\" r=\"8\" fill=\"#14909e\">\n        <animate attributeName=\"opacity\" from=\"1\" to=\"0.1\" begin=\"0.87s\" dur=\"1s\" repeatCount=\"indefinite\"></animate>\n        <animateTransform attributeName=\"transform\" type=\"scale\" from=\"1.5\" to=\"1\" begin=\"0.87s\" dur=\"1s\" repeatCount=\"indefinite\"></animateTransform>\n      </circle>\n    </g>\n  </g>\n</svg>";
