import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { ICreditScore, ICreditScoreFactor } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';
import { Source } from 'lib/utils/mergereport/Common/Source';
import { CreditScoreFactor } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/CreditScoreFactor';

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
