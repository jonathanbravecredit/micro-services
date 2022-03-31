import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { CreditScoreFactor } from './credit-score-factor';
export class CreditScore extends Homogenize {
    constructor(_data) {
        super(_data);
        this.CreditScoreFactor = [];
        this.qualitativeRank = null;
        this.inquiriesAffectedScore = null;
        this.new = null;
        this.riskScore = null;
        this.scoreName = null;
        this.populationRank = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditScoreFactor = this.homogenizeArray(this.CreditScoreFactor, CreditScoreFactor);
        this.CreditScoreMode = new CodeRef(this.CreditScoreMode);
        this.NoScoreReason = new CodeRef(this.NoScoreReason);
        this.Source = new Source(this.Source);
    }
}
