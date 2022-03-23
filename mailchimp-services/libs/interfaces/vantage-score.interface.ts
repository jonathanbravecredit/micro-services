import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditScoreFactor } from 'libs/interfaces/mergereport.interface';

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
