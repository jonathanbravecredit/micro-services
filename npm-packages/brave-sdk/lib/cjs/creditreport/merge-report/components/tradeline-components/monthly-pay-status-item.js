"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyPayStatusItem = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class MonthlyPayStatusItem extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.PaymentDue = null;
        this.CreditLimit = null;
        this.ActualPayment = null;
        this.PastDue = null;
        this.highCredit = null;
        this.status = null;
        this.date = null;
        this.currentBalance = null;
        this.changed = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.GenericRemark = new code_ref_1.CodeRef(this.GenericRemark);
        this.RatingRemark = new code_ref_1.CodeRef(this.RatingRemark);
        this.ComplianceRemark = new code_ref_1.CodeRef(this.ComplianceRemark);
    }
}
exports.MonthlyPayStatusItem = MonthlyPayStatusItem;
