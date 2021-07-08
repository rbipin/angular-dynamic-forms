import { IAnswer } from '../models/answers';
import { IQuestion } from '../models/questions';

export interface ITrailQuestionAnswers {
    questions: IQuestion[] | null;
    answers: IAnswer[] | null;
}

