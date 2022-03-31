import { ITUServiceResponse } from '../../_types/common-tu';
import { ITransunionErrorCode } from '../../_types/tu-error-codes';
export declare class TransunionExceptionQueries {
    constructor();
    static getErrorCodeDetails(code: string): ITransunionErrorCode;
    static isErrorCritical(resp: ITUServiceResponse<any>): boolean;
    static isPinStale(pinAge: number): boolean;
    static isKBAStale(kbaAge: number): boolean;
}
