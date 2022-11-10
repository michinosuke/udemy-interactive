// 問題の配列
// {
//   answers: boolean[]              # 正解は true、不正解は false の配列
//   choiceLabelElements: Element[]  # 選択肢の label 要素
//   choiceLiElements: Element[]     # 選択肢の li 要素
//   element: Element                # 問題の要素
//   explanationElement: Element     # 説明の要素
//   selects: boolean[]              # 選択中の選択肢は true、それ以外は false。一度も選択されていない場合は、全てnull。
//   isExpand: boolean               # 説明が表示中の場合は true。
// } []
const questions = []

// モード選択ボタンの要素。initializeで代入される。
let buttonSeitoNomi
let buttonIchimonItto

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
            } else {
                // クリック済でない選択肢からボーダーを削除する
                choiceElement.classList.remove('ui-selected')
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
        // 選択肢が全て選択されていないことにする（要検証）
        question.selects = question.selects.map(() => false)

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
    } else {
        // 選択肢が全て選択されていないことにする
        question.selects = question.selects.map(() => null)

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
}

// モードを変更する
// 初期表示時、モード変更ボタンの押下時に呼び出される
const setMode = (mode) => {
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
                choiceElement.classList.add('display-none')
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

// 初回のみ実行するフォーマット
const initialize = () => {
    // ローディングしたとこの要素。問題が全部含まれてる。
    const detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")

    // 問題の要素の配列
    const questionElements = [...detailedResultPanel.querySelectorAll(':scope > div')].filter((div) => div.className.includes('question'))

    // 問題の要素それぞれに対して
    questionElements.forEach((questionElement, questionIndex) => {
        // 問題の要素に含まれる label 要素の配列
        const choiceLabelElements = [...questionElement.querySelectorAll('label')]

        // 問題の要素に含まれる li 要素の配列
        const choiceLiElements = [...questionElement.querySelectorAll('li')]

        // 問題の要素の含まれる div 要素のうち、クラス名に explanation を含むものの配列
        const explanation = [...questionElement.querySelectorAll('div')].find((div) => div.className.includes('explanation'))

        // questionsに追加するオブジェクト（各プロパティの意味はこのファイル上部を参照）
        const question = {
            element: questionElement,
            choiceLabelElements,
            choiceLiElements,
            choiceCallbacks: choiceLabelElements.map((_, i) => () => onClickChoice(questionIndex, i)),
            answers: [],
            selects: choiceLabelElements.map(() => null),
            explanationElement: explanation,
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

        // questionsに追加する
        questions.push(question)
    })

    // 未回答って表示が邪魔なので消す
    const statusButtons = [...detailedResultPanel.querySelectorAll(':scope div')].filter((div) => div.innerHTML === '未回答')
    statusButtons.forEach(statusButton => statusButton.classList.add('display-none'))

    // n回目の試み → Udemy Interactive
    const title = [...detailedResultPanel.querySelectorAll(':scope div')].find((div) => div.innerHTML.match(/^\d+回目の試み$/))
    title.innerHTML = 'Udemy Interactive'

    // ラジオボタンの非表示
    const radios = document.querySelectorAll('input[checked]')
    radios.forEach(radio => radio.checked = false)

    // (正解) の非表示
    const texts = [...detailedResultPanel.querySelectorAll(':scope div')].filter(div => ['(正解)', '(不正解)'].includes(div.innerHTML))
    texts.forEach(text => text.classList.add('display-none'))

    // footer（正答のみボタンとか表示されてるとこ）
    const footer = document.querySelector('footer')

    // 正答のみボタンを追加する
    buttonSeitoNomi = document.createElement('button')
    buttonSeitoNomi.innerHTML = '正答のみ'
    buttonSeitoNomi.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-large', 'udlite-btn-large', 'ud-btn-secondary', 'udlite-btn-secondary')
    buttonSeitoNomi.addEventListener('click', () => setMode('SEITO_NOMI'))
    footer.prepend(buttonSeitoNomi)

    // 一問一答ボタンを追加する
    buttonIchimonItto = document.createElement('button')
    buttonIchimonItto.innerHTML = '一問一答'
    buttonIchimonItto.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-large', 'udlite-btn-large', 'ud-btn-secondary', 'udlite-btn-secondary')
    buttonIchimonItto.addEventListener('click', () => setMode('ICHIMON_ITTO'))
    footer.prepend(buttonIchimonItto)
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
            choiceLiElement.classList.remove('display-none')
        })

        // selects を全て null にして、選択肢がクリックされていない状態にする
        question.selects = question.selects.map(() => null)

        // 説明が非表示の状態にする
        question.isExpand = false
    })
}

// 問題の見直し画面でローディングが終わるのを監視する。
const waitAppearQuestionsId = setInterval(() => {
    detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")
    if (detailedResultPanel) {
        // ローディングが終了すると実行される
        initialize() // 初期処理
        setMode('ICHIMON_ITTO') // 初期モードは一問一答
        clearInterval(waitAppearQuestionsId) // 監視のsetIntervalを解除する
    }
}, 100)
