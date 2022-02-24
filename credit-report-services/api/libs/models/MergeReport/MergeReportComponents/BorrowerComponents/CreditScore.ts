import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditScore, ICreditScoreFactor } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';
import { CreditScoreFactor } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/CreditScoreFactor';

export class CreditScore extends Homogenize<Partial<ICreditScore>> implements ICreditScore {
  CreditScoreFactor: ICreditScoreFactor[] = [];
  CreditScoreMode: ICodeRef;
  NoScoreReason: ICodeRef;
  Source: ISource;
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
