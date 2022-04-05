import { TransunionErrorAction } from '../constants/transunion';
export interface ITransunionErrorCode {
    code: string;
    name: string;
    message: string;
    category: string;
    method: string;
    action: TransunionErrorAction;
}
