import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { SourceSummary } from '../common/source-summary';
import { BankingPartition } from './banking-partition';
import { Borrower } from './borrower';
import { InquiryPartition } from './inquiry-partition';
import { Message } from './message';
import { PublicPartition } from './public-partition';
import { SB168Frozen } from './sB168-frozen';
import { Subscriber } from './subscriber';
import { Summary } from './summary';
import { TradeLinePartition } from './tradeine-partition';
export class TrueLinkCreditReportType extends Homogenize {
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
        this.SB168Frozen = new SB168Frozen(this.SB168Frozen);
        this.Borrower = new Borrower(this.Borrower);
        this.TradeLinePartition = this.homogenizeArray(this.TradeLinePartition, TradeLinePartition);
        this.InquiryPartition = this.homogenizeArray(this.InquiryPartition, InquiryPartition);
        this.BankingRecordPartition = this.homogenizeArray(this.BankingRecordPartition, BankingPartition);
        this.PulblicRecordPartition = this.homogenizeArray(this.PulblicRecordPartition, PublicPartition);
        this.Subscriber = this.homogenizeArray(this.Subscriber, Subscriber);
        this.Message = this.homogenizeArray(this.Message, Message);
        this.Summary = new Summary(this.Summary);
        this.Sources = this.homogenizeArray(this.Sources, SourceSummary);
    }
}
