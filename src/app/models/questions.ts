import { INextStep } from './nextStep';
import { IQuestionOption } from './questionOption';

export interface IQuestion {
    key: string;
    label: string;
    required: boolean;
    controlType: string;
    options: IQuestionOption[];
    reasonForAsking: string;
    placeholder: string;
    group: string;
    nextSteps: INextStep[];
    value: string[];
}
