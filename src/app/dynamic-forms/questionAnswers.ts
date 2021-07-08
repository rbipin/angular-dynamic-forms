import { IQuestion } from '../models/questions';


export class QuestionAnswers {
    private trailQuestions: IQuestion[] = [];

    constructor(trailQA: IQuestion[]) {
        this.trailQuestions = trailQA;
    }

    getQuestion(questionKey: string): IQuestion {
        return this.trailQuestions.find(question => question.key === questionKey);
    }

    hasAnswer(question: IQuestion): boolean {
        if (question == null) {
            return false;
        }
        if ((question.value == null) || question.value.length === 0) {
            return false;
        }
        return true;
    }
    getNextQuestions(questionValue: string[], questionDetail: IQuestion): IQuestion[] | null {
        const questionsToDisplay: IQuestion[] = [];
        if (questionValue == null) {
            return null;
        }
        if (questionDetail == null || questionDetail.nextSteps == null || questionDetail.nextSteps.length === 0) {
            return null;
        }
        for (const qVal of questionValue) {
            const questionStep = questionDetail.nextSteps.find(step => step.value.toLowerCase() === qVal.toLowerCase()
                || step.value === '');
            if (questionStep == null || questionStep.nextQuestionId == null) {
                continue;
            }
            questionStep.nextQuestionId.forEach(questionId => {
                const step = this.trailQuestions?.find(question => question.key === questionId);
                /* To Create a copy and not affect same instance, otherwise values will be retained */
                const copyOfQuestion: IQuestion = {} as any;
                Object.assign(copyOfQuestion, step);
                questionsToDisplay.push(copyOfQuestion);
            });
        }
        return questionsToDisplay;
    }
}
