"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScore = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
const credit_score_factor_1 = require("./credit-score-factor");
class CreditScore extends homogenize_data_1.Homogenize {
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
        this.CreditScoreFactor = this.homogenizeArray(this.CreditScoreFactor, credit_score_factor_1.CreditScoreFactor);
        this.CreditScoreMode = new code_ref_1.CodeRef(this.CreditScoreMode);
        this.NoScoreReason = new code_ref_1.CodeRef(this.NoScoreReason);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.CreditScore = CreditScore;
