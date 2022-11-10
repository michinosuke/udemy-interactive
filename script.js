// 問題の配列
// answers: boolean[]
// choiceLabelElements: Element[]
// choiceLiElements: Element[]
// element: Element
// explanationElement: Element
// selects: boolean[]
// isExpand: boolean
const questions = []
let detailedResultPanel = null
let buttonSeitoNomi
let buttonIchimonItto
let doneFirstReset = false

const onClickChoice = (questionIndex, choiceIndex) => {
    const question = questions[questionIndex]
    question.selects[choiceIndex] = !question.selects[choiceIndex]
    const correctCount = question.answers.filter(answer => answer).length
    const selectedCount = question.selects.filter(select => select).length
    const choiceLabelElements = question.choiceLabelElements
    const answers = question.answers
    const explanationElement = question.explanationElement

    if (!question.isExpand) {
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            if (question.selects[choiceIndex]) {
                choiceElement.classList.add('ui-selected')
            } else {
                choiceElement.classList.remove('ui-selected')
            }
        })
    }

    if (!question.isExpand && selectedCount < correctCount) {
        return
    }

    question.isExpand = !question.isExpand

    if (question.isExpand) {
        question.selects = question.selects.map(() => false)
        explanationElement.classList.remove('display-none')
        explanationElement.classList.add('display-active')
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            choiceElement.classList.remove('background-none')
            if (answers[choiceIndex]) {
                choiceElement.classList.add('ui-correct')
            } else {
                choiceElement.classList.add('ui-incorrect')
            }
        })
    } else {
        question.selects = question.selects.map(() => null)
        explanationElement.classList.add('display-none')
        explanationElement.classList.remove('display-active')
        choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            choiceElement.classList.remove('ui-incorrect')
            choiceElement.classList.remove('ui-correct')
            choiceElement.classList.add('background-none')
            choiceElement.classList.remove('ui-selected')
        })
    }
}

const setMode = (mode) => {
    reset()

    buttonSeitoNomi.classList.remove('selected')
    buttonIchimonItto.classList.remove('selected')

    switch(mode) {
        case 'ICHIMON_ITTO':
            buttonIchimonItto.classList.add('selected')
            onModeIchimonItto()
            break
        case 'SEITO_NOMI':
            buttonSeitoNomi.classList.add('selected')
            onModeSeitoNomi()
            break
    }
}

const onModeSeitoNomi = () => {
    questions.forEach(question => {
        question.explanationElement.classList.add('display-none')
        question.choiceLiElements.forEach((choiceElement, choiceIndex) => {
            if (!question.answers[choiceIndex]) {
                choiceElement.classList.add('display-none')
            }
        })
        question.choiceLabelElements.forEach((choiceLabelElement, choiceIndex) => {
            if (question.answers[choiceIndex]) {
                choiceLabelElement.addEventListener('click', question.choiceCallbacks[choiceIndex])
            }
        })
    })
}

const onModeIchimonItto = () => {
    questions.forEach(question => {
        question.explanationElement.classList.add('display-none')
        question.choiceLabelElements.forEach((choiceElement, choiceIndex) => {
            choiceElement.addEventListener('click', question.choiceCallbacks[choiceIndex])
        })
    })
}

const reset = () => {
    if (!doneFirstReset) {
        const questionElements = [...detailedResultPanel.querySelectorAll(':scope > div')].filter((div) => div.className.includes('question'))
        questionElements.forEach((question, questionIndex) => {
            const choiceLabelElements = [...question.querySelectorAll('label')]
            const choiceLiElements = [...question.querySelectorAll('li')]
            const explanation = [...question.querySelectorAll('div')].find((div) => div.className.includes('explanation'))
            const q = {
                element: question,
                choiceLabelElements,
                choiceLiElements,
                choiceCallbacks: choiceLabelElements.map((_, i) => () => onClickChoice(questionIndex, i)),
                answers: [],
                selects: choiceLabelElements.map(() => null),
                explanationElement: explanation,
                isExpand: false
            }
            choiceLabelElements.forEach((choice, choiceIndex) => {
                let isCorrect = false
                const classList = [...choice.classList]
                classList.forEach((klass) => {
                    if (klass.match(/(?<!in)correct/)) {
                        isCorrect = true
                    }
                    if (klass.match(/correct/)) {
                        choice.classList.replace(klass, klass + '----')
                    }
                })
                q.answers.push(isCorrect)
            })
            questions.push(q)
        })

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

        doneFirstReset = true
    }

    detailedResultPanel.classList.add('detailed-result-panel')

    questions.forEach(question => {
        question.explanationElement.classList.remove('display-none')
        question.explanationElement.classList.remove('display-active')
        question.choiceLabelElements.forEach((choiceLabelElement, choiceIndex) => {
            choiceLabelElement.classList.remove('ui-correct')
            choiceLabelElement.classList.remove('ui-incorrect')
            choiceLabelElement.classList.remove('ui-selected')
            choiceLabelElement.removeEventListener('click', question.choiceCallbacks[choiceIndex])
        })
        question.choiceLiElements.forEach((choiceLiElement) => {
            choiceLiElement.classList.remove('display-none')
        })
        question.selects = question.selects.map(() => null)
        question.isExpand = false
    })

    const footer = document.querySelector('footer')

    if (!buttonSeitoNomi) {
        buttonSeitoNomi = document.createElement('button')
        buttonSeitoNomi.innerHTML = '正答のみ'
        buttonSeitoNomi.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-large', 'udlite-btn-large', 'ud-btn-secondary', 'udlite-btn-secondary')
        buttonSeitoNomi.addEventListener('click', () => setMode('SEITO_NOMI'))
        footer.prepend(buttonSeitoNomi)
    }

    if (!buttonIchimonItto) {
        buttonIchimonItto = document.createElement('button')
        buttonIchimonItto.innerHTML = '一問一答'
        buttonIchimonItto.classList.add('mode-button', 'ud-btn', 'udlite-btn', 'ud-btn-large', 'udlite-btn-large', 'ud-btn-secondary', 'udlite-btn-secondary')
        buttonIchimonItto.addEventListener('click', () => setMode('ICHIMON_ITTO'))
        footer.prepend(buttonIchimonItto)
    }
}

const onLoadPage = () => {
    setMode('ICHIMON_ITTO')
}

const waitAppearQuestionsId = setInterval(() => {
    detailedResultPanel = document.querySelector("div[data-purpose='detailed-result-panel']")
    if (detailedResultPanel) {
        onLoadPage()
        clearInterval(waitAppearQuestionsId)
    }
}, 100)
