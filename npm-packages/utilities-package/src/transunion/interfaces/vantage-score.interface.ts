import { ICodeRef, ISource } from './common-tu.interface';
import { ICreditScoreFactor } from './merge-report.interface';

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
