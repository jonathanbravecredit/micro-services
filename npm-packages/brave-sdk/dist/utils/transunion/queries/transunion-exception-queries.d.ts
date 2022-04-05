import { ITransunionErrorCode, ITUServiceResponse } from '../../../types';
export declare class TransunionExceptionQueries {
    constructor();
    static getErrorCodeDetails(code: string): ITransunionErrorCode;
    static isErrorCritical(resp: ITUServiceResponse<any>): boolean;
    static isPinStale(pinAge: number): boolean;
    static isKBAStale(kbaAge: number): boolean;
}
