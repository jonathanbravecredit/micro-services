"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantedTrade = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const pay_status_history_1 = require("./pay-status-history");
class GrantedTrade extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.CreditLimit = null;
        this.monthsReviewed = null;
        this.monthlyPayment = null;
        this.late90Count = null;
        this.late60Count = null;
        this.late30Count = null;
        this.actualPaymentAmount = null;
        this.worstPatStatusCount = null;
        this.termMonths = null;
        this.dateLastPayment = null;
        this.collateral = null;
        this.amountPastDue = null;
        this.dateWorstPayStatus = null;
        this.datePastDue = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.AccountType = new code_ref_1.CodeRef(this.AccountType);
        this.CreditType = new code_ref_1.CodeRef(this.CreditType);
        this.PaymentFrequency = new code_ref_1.CodeRef(this.PaymentFrequency);
        this.TermType = new code_ref_1.CodeRef(this.TermType);
        this.WorstPayStatus = new code_ref_1.CodeRef(this.WorstPayStatus);
        this.PayStatusHistory = new pay_status_history_1.PayStatusHistory(this.PayStatusHistory);
    }
}
exports.GrantedTrade = GrantedTrade;
