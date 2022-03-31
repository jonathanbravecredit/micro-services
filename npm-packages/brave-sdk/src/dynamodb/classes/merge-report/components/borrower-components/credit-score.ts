import { ICodeRef, ISource } from '../../../../../_types/common-tu';
import { ICreditScore, ICreditScoreFactor } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { CreditScoreFactor } from './credit-score-factor';

export class CreditScore extends Homogenize<Partial<ICreditScore>> implements ICreditScore {
  CreditScoreFactor: ICreditScoreFactor[] = [];
  CreditScoreMode!: ICodeRef;
  NoScoreReason!: ICodeRef;
  Source!: ISource;
  qualitativeRank: number | string | null = null;
  inquiriesAffectedScore: boolean | string | null = null;
  new: boolean | null = null;
  riskScore: number | string | null = null;
  scoreName: string | null = null;
  populationRank: number | string | null = null;

  constructor(_data: Partial<ICreditScore>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditScoreFactor = this.homogenizeArray<ICreditScoreFactor, CreditScoreFactor>(
      this.CreditScoreFactor,
      CreditScoreFactor,
    );
    this.CreditScoreMode = new CodeRef(this.CreditScoreMode);
    this.NoScoreReason = new CodeRef(this.NoScoreReason);
    this.Source = new Source(this.Source);
  }
}
