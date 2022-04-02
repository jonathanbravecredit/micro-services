import { CreditScoreFactor } from '../models/merge-report/components/borrower-components/credit-score-factor';
import { ICodeRef, ISource } from './common-tu';

export interface IVantageScore {
  CreditScoreType: ICreditScoreType;
}

export interface ICreditScoreType {
  riskScore?: number;
  scoreName?: string;
  populationRank?: number;
  CreditScoreFactor?: CreditScoreFactor[];
  CreditScoreModel?: ICodeRef;
  NoScoreReason?: ICodeRef;
  Source?: ISource;
}
