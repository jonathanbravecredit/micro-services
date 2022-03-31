"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrueLinkCreditReportType = void 0;
const homogenize_data_1 = require("../../homogenize/homogenize-data");
const source_summary_1 = require("../common/source-summary");
const banking_partition_1 = require("./banking-partition");
const borrower_1 = require("./borrower");
const inquiry_partition_1 = require("./inquiry-partition");
const message_1 = require("./message");
const public_partition_1 = require("./public-partition");
const sB168_frozen_1 = require("./sB168-frozen");
const subscriber_1 = require("./subscriber");
const summary_1 = require("./summary");
const tradeine_partition_1 = require("./tradeine-partition");
class TrueLinkCreditReportType extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.TradeLinePartition = [];
        this.InquiryPartition = [];
        this.BankingRecordPartition = [];
        this.PulblicRecordPartition = [];
        this.Subscriber = [];
        this.Message = [];
        this.Sources = [];
        this.SafetyCheckPassed = null;
        this.DeceasedIndicator = null;
        this.FraudIndicator = null;
        this.CreditVision = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.SB168Frozen = new sB168_frozen_1.SB168Frozen(this.SB168Frozen);
        this.Borrower = new borrower_1.Borrower(this.Borrower);
        this.TradeLinePartition = this.homogenizeArray(this.TradeLinePartition, tradeine_partition_1.TradeLinePartition);
        this.InquiryPartition = this.homogenizeArray(this.InquiryPartition, inquiry_partition_1.InquiryPartition);
        this.BankingRecordPartition = this.homogenizeArray(this.BankingRecordPartition, banking_partition_1.BankingPartition);
        this.PulblicRecordPartition = this.homogenizeArray(this.PulblicRecordPartition, public_partition_1.PublicPartition);
        this.Subscriber = this.homogenizeArray(this.Subscriber, subscriber_1.Subscriber);
        this.Message = this.homogenizeArray(this.Message, message_1.Message);
        this.Summary = new summary_1.Summary(this.Summary);
        this.Sources = this.homogenizeArray(this.Sources, source_summary_1.SourceSummary);
    }
}
exports.TrueLinkCreditReportType = TrueLinkCreditReportType;
