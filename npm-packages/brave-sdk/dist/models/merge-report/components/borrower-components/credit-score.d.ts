import { ICodeRef, ISource } from '../../../../types';
import { ICreditScore, ICreditScoreFactor } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class CreditScore extends Homogenize<Partial<ICreditScore>> implements ICreditScore {
    CreditScoreFactor: ICreditScoreFactor[];
    CreditScoreMode: ICodeRef;
    NoScoreReason: ICodeRef;
    Source: ISource;
    qualitativeRank: number | string | null;
    inquiriesAffectedScore: boolean | string | null;
    new: boolean | null;
    riskScore: number | string | null;
    scoreName: string | null;
    populationRank: number | string | null;
    constructor(_data: Partial<ICreditScore>);
    init(): void;
}
