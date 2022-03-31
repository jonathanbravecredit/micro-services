import { ICodeRef, ISource } from './common-tu';
import { ICreditScoreFactor } from './merge-report';
export interface IVantageScore {
    CreditScoreType: ICreditScoreType;
}
export interface ICreditScoreType {
    riskScore?: number;
    scoreName?: string;
    populationRank?: number;
    CreditScoreFactor?: ICreditScoreFactor[];
    CreditScoreModel?: ICodeRef;
    NoScoreReason?: ICodeRef;
    Source?: ISource;
}
