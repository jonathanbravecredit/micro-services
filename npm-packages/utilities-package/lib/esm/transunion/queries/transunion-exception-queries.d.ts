import { ITUServiceResponse } from '../interfaces/common-tu.interface';
import { ITransunionErrorCode } from '../interfaces/tu-error-codes.interface';
export declare class TransunionExceptionQueries {
    constructor();
    static getErrorCodeDetails(code: string): ITransunionErrorCode;
    static isErrorCritical(resp: ITUServiceResponse<any>): boolean;
    static isPinStale(pinAge: number): boolean;
    static isKBAStale(kbaAge: number): boolean;
}
