import { INextStep } from './nextStep';
import { IQuestionOption } from './questionOption';

export interface IQuestion {
    key: string | null;
    label: string | null;
    required: boolean;
    controlType: string | null;
    options: IQuestionOption[] | null;
    placeholder: string | null;
    group: string | null;
    nextSteps?: INextStep[] | null;
    value: string[] | null;
}
