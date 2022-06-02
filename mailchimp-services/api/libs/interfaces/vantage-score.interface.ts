import { ICodeRef, ISource } from '@bravecredit/brave-sdk/dist/types/common-tu';
import { ICreditScoreFactor } from '@bravecredit/brave-sdk/dist/types/merge-report';

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
