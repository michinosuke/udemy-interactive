let isLoading = true

const intervalId1 = setInterval(() => {
    const wrapper = document.querySelector("div[data-purpose='detailed-result-panel']")
    if (wrapper) {
        isLoading = false
        clearInterval(intervalId1)
    }
}, 100)

const intervalId2 = setInterval(() => {
    if (isLoading) return
    clearInterval(intervalId2)

    const wrapper = document.querySelector("div[data-purpose='detailed-result-panel']")

    const qs = []
    // color
    const questions = [...wrapper.querySelectorAll(':scope > div')].filter((div) => div.className.includes('question'))
    questions.forEach((question, questionIndex) => {
        const choices = [...question.querySelectorAll('label')]
        const explanation = [...question.querySelectorAll('div')].find((div) => div.className.includes('explanation'))
        explanation.classList.add('display-none')
        const q = {
            element: question,
            choiceElements: choices,
            answers: [],
            selects: choices.map(() => null),
            explanationElement: explanation
        }
        choices.forEach((choice, choiceIndex) => {
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
            choice.addEventListener('click', (e) => {
                qs[questionIndex].selects = qs[questionIndex].selects.map(() => false)
                qs[questionIndex].selects[choiceIndex] = true
                changeQuestionUI(qs[questionIndex])
            })
            q.answers.push(isCorrect)
        })
        qs.push(q)
    })

    const changeQuestionUI = (question) => {
        const choiceElements = question.choiceElements
        const answers = question.answers
        const selects = question.selects
        const explanationElement = question.explanationElement
        choiceElements.forEach((choiceElement, choiceIndex) => {
            const uiClass = answers[choiceIndex] ? 'ui-correct' : 'ui-incorrect'
            choiceElement.classList.toggle(uiClass)
        })
        explanationElement.classList.toggle('display-none')
        explanationElement.classList.toggle('display-active')
    }

    // hide check
    const radios = document.querySelectorAll('input[checked]')
    radios.forEach(radio => radio.checked = false)

    // hide text
    const texts = [...document.querySelectorAll('div.udlite-heading-sm')]
    texts.forEach(text => text.classList.add('display-none'))
}, 100)