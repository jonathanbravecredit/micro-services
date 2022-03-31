"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tradeline = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const remark_1 = require("../../common/remark");
const source_1 = require("../../common/source");
const collection_trade_1 = require("./collection-trade");
const granted_trade_1 = require("./granted-trade");
const watch_trade_1 = require("./watch-trade");
class Tradeline extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.subscriberCode = null;
        this.highBalance = null;
        this.dateVerified = null;
        this.handle = null;
        this.bureau = null;
        this.position = null;
        this.dateReported = null;
        this.currentBalance = null;
        this.creditorName = null;
        this.accountNumber = null;
        this.dateOpened = null;
        this.dateClosed = null;
        this.dateAccountStatus = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.AccountCondition = new code_ref_1.CodeRef(this.AccountCondition);
        this.AccountDesignator = new code_ref_1.CodeRef(this.AccountDesignator);
        this.DisputeFlag = new code_ref_1.CodeRef(this.DisputeFlag);
        this.IndustryCode = new code_ref_1.CodeRef(this.IndustryCode);
        this.OpenClosed = new code_ref_1.CodeRef(this.OpenClosed);
        this.PayStatus = new code_ref_1.CodeRef(this.PayStatus);
        this.VerificationIndicator = new code_ref_1.CodeRef(this.VerificationIndicator);
        this.Remark = this.homogenizeArray(this.Remark, remark_1.Remark);
        this.WatchTrade = new watch_trade_1.WatchTrade(this.WatchTrade);
        this.GrantedTrade = new granted_trade_1.GrantedTrade(this.GrantedTrade);
        this.CollectionTrade = new collection_trade_1.CollectionTrade(this.CollectionTrade);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.Tradeline = Tradeline;
