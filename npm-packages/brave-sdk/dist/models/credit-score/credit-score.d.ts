import 'reflect-metadata';
export declare class BraveCreditScore {
    id: string;
    scoreId: number;
    bureauId: string;
    score: number;
    createdOn?: string;
    modifiedOn?: string;
}
export declare class BraveCreditScoreMaker implements BraveCreditScore {
    id: string;
    scoreId: number;
    score: number;
    bureauId: string;
    createdOn?: string | undefined;
    modifiedOn?: string | undefined;
    constructor(id: string, scoreId: number, bureauId: string, score: number);
}
