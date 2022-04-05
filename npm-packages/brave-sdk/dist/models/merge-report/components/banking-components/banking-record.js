"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingRecord = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const remark_1 = require("../../common/remark");
const source_1 = require("../../common/source");
class BankingRecord extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.Remark = [];
        this.dateOpened = null;
        this.dateClosed = null;
        this.bureau = null;
        this.dateVerified = null;
        this.subscriberCode = null;
        this.bankName = null;
        this.balance = null;
        this.accountNumber = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BankingType = new code_ref_1.CodeRef(this.BankingType);
        this.AccountDesignator = new code_ref_1.CodeRef(this.AccountDesignator);
        this.IndustryCode = new code_ref_1.CodeRef(this.IndustryCode);
        this.Status = new code_ref_1.CodeRef(this.Status);
        this.Remark = this.homogenizeArray(this.Remark, remark_1.Remark);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BankingRecord = BankingRecord;
