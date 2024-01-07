'use strict';

class Questionnaire {
    constructor(wrapper, questions) {
        this.currentIndex = 0;
        this.points = [];
        this.questions = questions;
        this.selectedPoints = [1, 2, 3, 4];
        this.styles = ['0', '100%', '200%', '300%'];
        this.indexOfSelected = undefined;
        
        this.wrapper = document.querySelector(wrapper);
        this.quizProgress = this.wrapper.querySelector('#quiz-progress');
        this.btnNext = this.wrapper.querySelector('#btn-show-next');
        this.main = this.wrapper.querySelector('.main');
        this.currentQuestion = this.main.querySelector('.app__content');
        this.optionsTextList = this.main.querySelector('.select__options__list');
        this.optionsCols = this.main.querySelector('.select__track');
        this.selectBarWrapper = this.optionsCols.querySelector('.bar-wrapper');
        this.modal = this.wrapper.querySelector('.modal-wrapper');

        this.responses = [
            { image: 'happy.svg', color: '#8ACC36', text: 'low level of projection' },
            { image: 'medium.svg', color: '#EFC029', text: 'medium level of projection' },
            { image: 'sad.svg', color: '#D62B2B', text: 'high level of projection' }
        ];
    }

    completeQuestionnaire() {
        this.calculateResults();
        this.setEmoticonColor();
        this.showResultModal();
    }

    setEmoticonColor() {
        const responseIndex = this.level;
        this.modal.querySelector('.emoticon').src = `img/${this.responses[responseIndex].image}`;
        this.responseText = this.modal.querySelector('#response-text');
        this.responseText.style.color = this.responses[responseIndex].color;
        this.responseText.innerText = this.responses[responseIndex].text;
    }

    showResultModal() {
        this.modal.style.display = null;

        this.modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-wrapper') || e.target.matches('.btn-close')) {
                this.modal.style.display = 'none';
            }
        });
    }

    calculateResults() {
        this.totalScore = this.points.reduce((acc, point) => acc + point, 0);

        if (this.totalScore <= 20) {
            this.level = 0;
        } else if (this.totalScore <= 30) {
            this.level = 1;
        } else {
            this.level = 2;
        }
    }

    handleOptionSelection(e) {
        if (!this.indexOfSelected) {
            if (e.target.matches('.select__bar')) {
                this.indexOfSelected = 0;
                this.setPoints();
            }
        }

        if (e.target.matches('.select__section')) {
            this.setIndexOfSelectedItem(e);
            this.setPoints();
            this.removeActiveStyles();
            this.setBarPosition();
        }

        if (isFinite(this.indexOfSelected)) {
            this.optionsTextList.children[this.indexOfSelected].classList.add('select__options__item--active');
        }
    }

    setBarPosition() {
        this.selectBarWrapper.style.transform = `translate(${this.styles[this.indexOfSelected]})`;
    }

    resetBarPosition() {
        this.selectBarWrapper.style.transform = null;
    }

    setIndexOfSelectedItem(e) {
        this.indexOfSelected = [...this.optionsCols.children].indexOf(e.target);
    }

    removeActiveStyles() {
        [...this.optionsTextList.children].forEach(elem => {
            elem.classList.remove('select__options__item--active');
        });
    }

    setPoints() {
        this.points[this.currentIndex] = this.selectedPoints[this.indexOfSelected];
    }

    handleNextButtonClick() {
        let score = this.points[this.currentIndex];
        let isLastQuestion = this.currentIndex === this.questions.length - 1;

        if (score) {
            this.removeActiveStyles();
            this.indexOfSelected = undefined;
            this.resetBarPosition();

            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex = this.currentIndex + 1;
                this.setQuizLength();
                this.setQuestion();
            } else if (isLastQuestion) {
                this.completeQuestionnaire();
            }
        }
    }

    setQuizLength() {
        this.quizProgress.textContent = `${this.currentIndex + 1}/${this.questions.length}`;
    }

    setQuestion() {
        this.currentQuestion.innerText = this.questions[this.currentIndex];
    }

    init() {
        this.setQuestion();
        this.setQuizLength();
        this.setEventHandlers();
    }

    setEventHandlers() {
        this.btnNext.addEventListener('click', () => this.handleNextButtonClick());
        this.optionsCols.addEventListener('click', (e) => this.handleOptionSelection(e));
    }
}

const questions = [
    "My reactions to conflicts are much sharper than they should be",
    "When I'm in a conflict situation, I experience feelings that remind me of how I felt in past conflicts",
    "In a conflict situation, I notice that I focus on what the other person is saying or doing",
    "I use strong language to describe my conflict with others, such as 'always' or 'never'",
    "In others, I notice positive qualities that I don't find in myself",
    "In others, I notice negative traits that are hard for me to accept in myself",
    "I find it difficult to admit a mistake. Instead, I immediately focus on something someone else did or said, blaming them for the mistake",
    "I tune out when someone tells me something I don't want to hear",
    "When I know I'm not liked by someone, I avoid those people, staying away from them as if they were contagious",
    "I make moral judgments about the character or behavior of people I don't like"
];