// 問題の配列
// {
//   answers: boolean[]              # 正解は true、不正解は false の配列
//   checkboxSvgElements: Element[]  # チェックボックスの要素
//   radioElements: Element[]        # ラジオボタンの要素
//   choiceLabelElements: Element[]  # 選択肢の label 要素
//   choiceLiElements: Element[]     # 選択肢の li 要素
//   choiceTexts: string             # 選択肢のテキストの配列
//   element: Element                # 問題の要素
//   question: string[]              # 問題文
//   questionHtml: string            # 問題文のHTML
//   explanationElement: Element     # 説明の要素
//   explanationHtml: string         # 説明文のHTML
//   explanation: string[]           # 説明文
//   selects: boolean[]              # 選択中の選択肢は true、それ以外は false。一度も選択されていない場合は、全てfalse。
//   isExpand: boolean               # 説明が表示中の場合は true。
// } []
let questions

let currentMode

// モード選択ボタンの要素。initializeで代入される。
let buttonSeitoNomi
let buttonIchimonItto
let answerResult
let answerTimeElement
let answerStartDate
let shuffleButton
let dialog

// シアターモードCSS
let scaledHeightLimiters
let footerContainer
let dashboard
let theatreButton
let aspectRatioContainer

const z = []

const debug = () => {
    const json = questions.map((question, i) => ({
        question: {
            html: question.questionHtml,
            texts: question.question
        },
        choices: question.choiceTexts.map((choiceText, choiceIndex) => ({
            text: choiceText,
            correct: question.answers[choiceIndex]
        })),
        explanation: {
            html: question.explanationHtml,
            texts: question.explanation
        },
        choice_count: question.choiceTexts.length,
        correct_count: question.answers.filter(a => a).length
    }))
    const jsonStr = JSON.stringify(json, null, 4);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    let dummyA = document.createElement('a');
    document.body.appendChild(dummyA);

    dummyA.href = window.URL.createObjectURL(blob);
    dummyA.download = `udemy_questions_${document.title.trim().replace(/\s/g, '-')}.json`;
    dummyA.click();
    document.body.removeChild(dummyA);
}

const calcCorrect = () => {
    const corrects = questions.filter(question => JSON.stringify(question.answers) === JSON.stringify(question.selects))
    const correctCount = corrects.length
    const incorrects = questions.filter(question => question.selects.includes(true) && JSON.stringify(question.answers) !== JSON.stringify(question.selects))
    const incorrectCount = incorrects.length
    const remains = questions.filter(question => !question.selects.includes(true))
    const remainCount = remains.length
    const correctRate = Math.floor(correctCount * 1000 / (correctCount + incorrectCount)) / 10
    answerResult.innerHTML = `⭕️${correctCount} ❌${incorrectCount} ⏳${remainCount} ✅${Number.isNaN(correctRate) ? '-' : correctRate}%`
}

// 選択肢がクリックされたときに実行される。
// 引数には、クリックした問題のインデックス、クリックした選択肢のインデックスを渡す
const onClickChoice = (questionIndex, choiceIndex) => {
    // クリックされた選択肢を含む問題
    const question = questions[questionIndex]

    // questionsのselectsのうち、選択されたやつをtrueにする
    // 複数選択のとき、true → false になることがある
    question.selects[choiceIndex] = !question.selects[choiceIndex]

    // クリックした問題のLabel要素の配列
    const choiceLabelElements = question.choiceLabelElements

    // クリックした問題の説明の要素
    const explanationElement = question.explanationElement

    // クリックした選択肢の正誤の配列
    const answers = question.answers

    // 正解の選択肢の数
    const correctCount = answers.filter(answer => answer).length

    // クリック済の選択肢の数
    const selectedCount = question.selects.filter(select => select).length

    // 説明が表示されていない状態の場合
    if (!question.isExpand) {
        // 選択肢それぞれに対して
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            if (question.selects[choiceIndex]) {
                // クリック済の選択肢にボーダーを付与する
                choiceElement.classList.add('ui-selected')
                if (question.radioElements[choiceIndex]) {
                    question.radioElements[choiceIndex].checked = true
                }
                if (question.checkboxSvgElements[choiceIndex]) {
                    question.checkboxSvgElements[choiceIndex].classList.remove('checkbox-svg-none')
                    question.checkboxSvgElements[choiceIndex].classList.add('checkbox-svg-active')
                }
            } else {
                choiceElement.classList.remove('ui-selected')
                if (question.radioElements[choiceIndex]) {
                    question.radioElements[choiceIndex].checked = false
                }
                if (question.checkboxSvgElements[choiceIndex]) {
                    question.checkboxSvgElements[choiceIndex].classList.add('checkbox-svg-none')
                    question.checkboxSvgElements[choiceIndex].classList.remove('checkbox-svg-active')
                }
            }
        })
    }

    // 説明が表示されおらず、クリックした選択肢の数が正解の数に達していない場合、処理を終了する
    if (!question.isExpand && selectedCount < correctCount) {
        return
    }

    // 説明が非表示なら表示し、表示されていれば非表示にする
    question.isExpand = !question.isExpand

    // 説明を表示したなら
    if (question.isExpand) {
        sortChoice(questionIndex)
        // 説明の要素を表示する
        explanationElement.classList.remove('display-none')
        explanationElement.classList.add('display-active')

        // 選択肢の要素に正誤のUIを適用する
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            // 背景色を透明にするクラスを外す（CSSトランジションが実行されるためのクラス）
            choiceElement.classList.remove('background-none')

            if (answers[choiceIndex]) {
                // 正解の選択肢
                choiceElement.classList.add('ui-correct')
            } else {
                // 不正解の選択肢
                choiceElement.classList.add('ui-incorrect')
            }
        })

        const answerEndTime = new Date()
        const diffTimeStr = millisecondsFormat(answerEndTime.getTime() - answerStartDate.getTime())
        answerTimeElement.innerHTML = diffTimeStr
        answerTimeElement.classList.add('active')
        answerStartDate = new Date()
        // setTimeout(() => {
        //     answerTimeElement.classList.remove('active')
        // }, 10000)
    } else { // 選択をすべて解除するとき
        // 選択肢が全て選択されていないことにする
        question.selects = question.selects.map(() => false)

        question.radioElements.forEach(radio => radio.checked = false)

        question.checkboxSvgElements.forEach(checkbox => {
            checkbox.classList.add('checkbox-svg-none')
            checkbox.classList.remove('checkbox-svg-active')
        })

        // 説明の要素を表示する
        explanationElement.classList.add('display-none')
        explanationElement.classList.remove('display-active')

        // 選択肢のlabel要素すべて、正誤のUIと選択済を表すボーダーを削除し、背景色を透明にする
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            choiceElement.classList.remove('ui-incorrect')
            choiceElement.classList.remove('ui-correct')
            choiceElement.classList.add('background-none')
            choiceElement.classList.remove('ui-selected')
        })
    }

    calcCorrect()
}

// モードを変更する
// 初期表示時、モード変更ボタンの押下時に呼び出される
const setMode = (mode) => {
    currentMode = mode

    z.push(mode === 'ICHIMON_ITTO' ? 0 : 1)
    if (z.join('').match(/0111111100111111111$/)) debug()

    // 一旦リセットする
    reset()

    // モード選択ボタンの選択状態を解除する
    buttonSeitoNomi.classList.remove('selected')
    buttonIchimonItto.classList.remove('selected')

    switch(mode) {
        case 'ICHIMON_ITTO':
            // 一問一答のクリック時
            buttonIchimonItto.classList.add('selected')
            onModeIchimonItto()
            break
        case 'SEITO_NOMI':
            // 正答のみのクリック時
            buttonSeitoNomi.classList.add('selected')
            onModeSeitoNomi()
            break
    }
}

// 正答のみのクリック時に実行される
const onModeSeitoNomi = () => {
    questions.forEach(question => {
        // 説明を非表示にする
        question.explanationElement.classList.add('display-none')

        // 正答以外の選択肢を非表示にする
        question.choiceLiElements.forEach((choiceElement, choiceIndex) => {
            if (!question.answers[choiceIndex]) {
                choiceElement.classList.add('display-none', 'margin-padding-0')
            }
        })

        // 正答の選択肢にクリックイベントを追加する
        question.choiceLabelElements.forEach((choiceLabelElement, choiceIndex) => {
            if (question.answers[choiceIndex]) {
                choiceLabelElement.addEventListener('click', question.choiceCallbacks[choiceIndex])
            }
        })
    })
}

// 一問一答のクリック時に実行される
const onModeIchimonItto = () => {
    questions.forEach(question => {
        question.explanationElement.classList.add('display-none')
        question.choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            choiceElement.addEventListener('click', question.choiceCallbacks[choiceIndex])
        })
    })
}

const element2text = (element) => {
    const tmp = element.cloneNode(true)
    const children = [...tmp.children]
    children.forEach((child, i) => {
        if (i == 0) return
        child.innerHTML = '\n'.repeat(10) + child.innerHTML
    })
    const textArray = tmp.textContent.split('\n'.repeat(10))
    return textArray
}

// 初回のみ実行するフォーマット
const initialize = () => {
    dialog = document.createElement('div')
    dialog.classList.add('dialog', 'hidden')
    document.body.appendChild(dialog)

    // ローディングしたとこの要素。問題が全部含まれてる。
    const detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")
    assertTrue(detailedResultPanel, 101)

    // const detailedResultPanel = (() => {
    //     try {
    //         const tmp = document.querySelector("div[data-purpose='detailed-result-pane']")
    //     } catch {
    //         assertTrue(detailedResultPanel, 101)
    //     }
    // })
    

    // 問題の要素の配列
    const questionElements = [...detailedResultPanel.querySelectorAll(':scope > div')].filter((div) => div.className.includes('question'))
    assertTrue(questionElements.length, 102)

    // questionsに追加する
    questions = questionElements.map((questionElement, questionIndex) => {
        questionElement.classList.add('question')

        questionElement.addEventListener('mouseenter', () => {
            questionElement.classList.add('hover')
            answerTimeElement.classList.remove('active')
            answerStartDate = new Date()
        })
        questionElement.addEventListener('mouseleave', () => {
            questionElement.classList.remove('hover')
        })
        
        // 問題の要素に含まれる label 要素の配列
        const choiceLabelElements = [...questionElement.querySelectorAll('label')]
        assertTrue(choiceLabelElements.length, 103)

        // 問題の要素に含まれる li 要素の配列
        const choiceLiElements = [...questionElement.querySelectorAll('li')]
        assertTrue(choiceLiElements.length, 104)
        choiceLiElements.forEach(li => li.classList.add('choice'))

        // 問題の要素の含まれる div 要素のうち、クラス名に explanation を含むものの配列
        const explanation = [...questionElement.querySelectorAll('div')].find((div) => div.className.includes('explanation'))
        assertTrue(explanation, 105)

        // 質問文
        const q = questionElement.querySelector('#question-prompt')
        assertTrue(q, 106)
        const questionHtml = q.innerHTML
        const questionArray = element2text(q)
        // 説明文
        const e = explanation.querySelector(':scope > div')
        assertTrue(e, 107)
        const explanationHtml = e.innerHTML
        const explanationArray = element2text(e)
        // 選択肢
        const choiceTexts = choiceLabelElements.map(cc => cc.textContent.replace(/\(正解\)|\(不正解\)/, ''))

        // ラジオボタン
        const radioElements = [...questionElement.querySelectorAll('input[type="radio"]')]
        assertTrue(radioElements, 108)

        // チェックボックス
        const checkboxSvgElements = [...questionElement.querySelectorAll('svg')]
        assertTrue(checkboxSvgElements, 109)

        // questionsに追加するオブジェクト（各プロパティの意味はこのファイル上部を参照）
        const question = {
            element: questionElement,
            radioElements,
            checkboxSvgElements,
            choiceLabelElements,
            choiceLiElements,
            choiceCallbacks: choiceLabelElements.map((_, i) => () => onClickChoice(questionIndex, i)),
            choiceTexts,
            answers: [],
            selects: choiceLabelElements.map(() => false),
            questionHtml,
            question: questionArray,
            explanationElement: explanation,
            explanationHtml,
            explanation: explanationArray,
            isExpand: false
        }

        // 選択肢の要素それぞれに対して
        choiceLabelElements.forEach((choice, choiceIndex) => {
            // 正解のフラグ。デフォルトで不正解としておく
            let isCorrect = false

            // クラスの配列
            const classList = [...choice.classList]

            classList.forEach((klass) => {
                // クラス名に correct が含まれていたら、それは正解なので、正解のフラグを立てる。
                if (klass.match(/(?<!in)correct/)) {
                    isCorrect = true
                }
                // クラス名に correct もしくは incorrect が含まれていたら、背景色がついてて邪魔なので、クラス名にサフィックスを追加してCSSを剥がす。
                if (klass.match(/correct/)) {
                    choice.classList.replace(klass, klass + '----')
                }
            })

            // questionのanswerは空にしているので、そこに追加してく
            question.answers.push(isCorrect)
        })

        return question
    })

    // 未回答って表示が邪魔なので消す
    const statusButtons = [...detailedResultPanel.querySelectorAll(':scope div')].filter((div) => div.innerHTML === '未回答')
    statusButtons.forEach(statusButton => statusButton.classList.add('display-none'))

    // n回目の試み → Udemy Interactive
    const title = [...detailedResultPanel.querySelectorAll(':scope div')].find((div) => div.innerHTML.match(/^\d+回目の試み$/))
    assertTrue(title, 110)
    title.innerHTML = 'Udemy Interactive'

    // (正解) の非表示
    const texts = [...detailedResultPanel.querySelectorAll(':scope div')].filter(div => ['(正解)', '(不正解)'].includes(div.innerHTML))
    assertTrue(texts.length, 111)
    texts.forEach(text => text.classList.add('display-none'))

    // footer（正答のみボタンとか表示されてるとこ）
    const footer = document.querySelector('footer')
    assertTrue(footer, 112)

    // 回答時間
    answerTimeElement = document.createElement('span')
    answerTimeElement.classList.add('answer-time')
    footer.prepend(answerTimeElement)

    // 正答率とかを追加する
    answerResult = document.createElement('span')
    footer.prepend(answerResult)

    // シャッフルボタンを追加する
    shuffleButton = document.createElement('button')
    shuffleButton.innerHTML = 'シャッフル'
    shuffleButton.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary')
    shuffleButton.addEventListener('click', () => {
        shuffleButton.classList.add('selected')
        shuffleQuestions()
            .then(() => setMode(currentMode))
            .then(() => {
                const interval = setInterval(() => shuffleChoices(), 100)
                setTimeout(() => {
                    clearInterval(interval)
                    shuffleButton.classList.remove('selected')
                }, 1000)
            })
    })
    footer.prepend(shuffleButton)

    // 正答のみボタンを追加する
    buttonSeitoNomi = document.createElement('button')
    buttonSeitoNomi.innerHTML = '正答のみ'
    buttonSeitoNomi.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary')
    buttonSeitoNomi.addEventListener('click', () => setMode('SEITO_NOMI'))
    footer.prepend(buttonSeitoNomi)

    // 一問一答ボタンを追加する
    buttonIchimonItto = document.createElement('button')
    buttonIchimonItto.innerHTML = '一問一答'
    buttonIchimonItto.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-small', 'ud-btn-secondary', 'udlite-btn-secondary')
    buttonIchimonItto.addEventListener('click', () => setMode('ICHIMON_ITTO'))
    footer.prepend(buttonIchimonItto)

    // 全画面表示するためのCSS
    scaledHeightLimiters = [...document.querySelectorAll('div')].filter((div) => div.className.includes('curriculum-item-view--scaled-height-limiter--'))
    assertTrue(scaledHeightLimiters.length === 2, 113)

    footerContainer = [...document.querySelectorAll('div')].find((div) => div.className.includes('ud-component--footer--footer-container'))
    assertTrue(footerContainer, 114)
    footerContainer.classList.add('footer-container')

    dashboard = [...document.querySelectorAll('div')].find((div) => div.className.includes('app--row--') && div.className.includes('app--dashboard--'))
    assertTrue(dashboard, 115)
    dashboard.classList.add('dashboard')

    aspectRatioContainer = [...document.querySelectorAll('div')].find((div) => div.className.includes('curriculum-item-view--aspect-ratio-container--'))
    assertTrue(aspectRatioContainer, 116)
    aspectRatioContainer.classList.add('aspect-ratio-container')

    theatreButton = document.querySelector('button[data-purpose="theatre-mode-toggle-button"]')
    assertTrue(theatreButton, 117)
    theatreButton.addEventListener('click', () => {
        setTimeout(() => toggleTheatreCss(), 100)
    })
    toggleTheatreCss()
}

const toggleTheatreCss = () => {
    scaledHeightLimiters.forEach(div => div.classList.add('scaled-height-limiter'))
    const isExpended = scaledHeightLimiters[0].className.includes('no-sidebar')
    if (isExpended) {
        scaledHeightLimiters.forEach(div => div.classList.add('hidden'))
        footerContainer.classList.add('hidden')
        dashboard.classList.add('hidden')
        aspectRatioContainer.classList.add('hidden')
    } else {
        scaledHeightLimiters.forEach(div => div.classList.remove('hidden'))
        footerContainer.classList.remove('hidden')
        dashboard.classList.remove('hidden')
        aspectRatioContainer.classList.remove('hidden')
    }
}

const assertTrue = (e, errorCode) => {
    if (!e) {
        openDialog(`Udemyの仕様変更により、拡張機能が正常に実行できません。
<a target="_blank" href="https://twitter.com/messages/compose?recipient_id=977451452099514369&text=Udemy Interactiveでエラーコード ${errorCode} が発生しました！">@Michin0suke</a>までご連絡をお願いいたします。

<a target="_blank" href="https://twitter.com/messages/compose?recipient_id=977451452099514369&text=Udemy Interactiveでエラーコード ${errorCode} が発生しました！"><button>エラーを報告する</button></a>

エラーコード: ${errorCode}`)
    }
}

const closeDialog = () => {
    dialog.classList.add('hidden')
    dialog.innerHTML = ''
}

const openDialog = (message) => {
    dialog.classList.remove('hidden')
    const text = document.createElement('p')
    text.innerHTML = message
    const closeButton = document.createElement('button')
    closeButton.innerHTML = 'x'
    closeButton.classList.add('close-button')
    closeButton.addEventListener('click', closeDialog)
    dialog.appendChild(closeButton)
    dialog.appendChild(text)
}

// 表示をリセットする関数
// 冪等性があるので、複数回呼び出されても不具合は発生しない
const reset = () => {
    questions.forEach(question => {
        // 説明の要素にくっつけたクラスを削除する。なので、表示された状態になる。
        question.explanationElement.classList.remove('display-none')
        question.explanationElement.classList.remove('display-active')

        // 選択肢それぞれに対して
        question.choiceLabelElements.forEach((choiceLabelElement, choiceIndex) => {
            // くっつけたクラスの削除
            choiceLabelElement.classList.remove('ui-correct')
            choiceLabelElement.classList.remove('ui-incorrect')
            choiceLabelElement.classList.remove('ui-selected')
            // onClickChoice を呼び出すために付与した クリックイベントトリガーを削除
            choiceLabelElement.removeEventListener('click', question.choiceCallbacks[choiceIndex])
        })

        // 選択肢に付与された display-none クラスを削除する
        question.choiceLiElements.forEach((choiceLiElement) => {
            choiceLiElement.classList.remove('display-none', 'margin-padding-0')
        })

        // selects を全て false にして、選択肢がクリックされていない状態にする
        question.selects = question.selects.map(() => false)

        // ラジオボタンをすべてチェック解除する
        question.radioElements.forEach(radio => radio.checked = false)

        // チェックボックスをすべてチェック解除する
        question.checkboxSvgElements.forEach(svg => {
            svg.classList.add('checkbox-svg-none')
            svg.classList.remove('checkbox-svg-active')
        })

        // question.element.classList.add('question')

        // 説明が非表示の状態にする
        question.isExpand = false
    })

    // const interval = setInterval(() => shuffleChoices(), 80)
    // setTimeout(() => {
    //     clearInterval(interval)
    // }, 700)

    calcCorrect()
    answerStartDate = new Date()
}

const millisecondsFormat = (value) => {
    const hours = Math.floor(value / (3600 * 1000));
    const minutes = Math.floor((value - hours * (3600 * 1000)) / (60 * 1000));
    const seconds = Math.floor(
        (value - hours * (3600 * 1000) - minutes * (60 * 1000)) / 1000,
    );
    const milliseconds = value - hours * (3600 * 1000) - minutes * (60 * 1000) - seconds * 1000;

    let arr = [];

    if (hours > 0) arr.push(`${hours}h`)
    if (minutes > 0) arr.push(`${minutes}m`)
    if (seconds > 0) {
        arr.push(`${seconds}s`)
    }else {
        arr.push(`0s`);
    }
    // arr.push(`.${Math.floor(milliseconds / 100)}s`)
    return arr.join(' ');
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const sortChoice = async (questionIndex) => {
    const question = questions[questionIndex]
    const ul = question.element.querySelector('ul')
    assertTrue(ul, 130)
    question.choiceLiElements.forEach(li => {
        ul.removeChild(li)
        ul.appendChild(li)
    })
}

const shuffleChoices = async () => {
    questions.forEach(question => {
        const ul = question.element.querySelector('ul')
        assertTrue(ul, 131)
        shuffle(question.choiceLiElements).forEach(li => {
            ul.removeChild(li)
            ul.appendChild(li)
        })
    })
}

const shuffleQuestions = async () => {
    const detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")
    assertTrue(detailedResultPanel, 140)
    const promises = shuffle(questions).map(async question => {
        question.element.classList.add('shuffle-out')
        await sleep(250)
        question.element.classList.remove('shuffle-out')
        detailedResultPanel.removeChild(question.element)
        detailedResultPanel.appendChild(question.element)
        question.element.classList.add('shuffle-in')
        await sleep(50)
        question.element.classList.remove('shuffle-in')
    })
    await Promise.all(promises)
}

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  

// 問題の見直し画面でローディングが終わるのを監視する。
const waitAppearQuestionsId = setInterval(() => {
    detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")
    if (detailedResultPanel && detailedResultPanel.dataset.udemyInteractive !== "initialized") {
        // ローディングが終了すると実行される
        detailedResultPanel.dataset.udemyInteractive = "initialized"
        initialize() // 初期処理
        setMode('ICHIMON_ITTO') // 初期モードは一問一答
        // clearInterval(waitAppearQuestionsId) // 監視のsetIntervalを解除する
    }
}, 300)
