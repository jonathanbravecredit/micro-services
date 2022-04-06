import { ISourceSummary } from '../../../types';
import { ITrueLinkCreditReportType, ISB168Frozen, IBorrower, ITradeLinePartition, IInquiryPartition, IBankingPartition, IPublicPartition, ISubscriber, IMessage, ISummary } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class TrueLinkCreditReportType extends Homogenize<Partial<ITrueLinkCreditReportType>> implements ITrueLinkCreditReportType {
    SB168Frozen: ISB168Frozen;
    Borrower: IBorrower;
    TradeLinePartition: ITradeLinePartition[];
    InquiryPartition: IInquiryPartition[];
    BankingRecordPartition: IBankingPartition[];
    PulblicRecordPartition: IPublicPartition[];
    Subscriber: ISubscriber[];
    Message: IMessage[];
    Summary: ISummary;
    Sources: ISourceSummary[];
    SafetyCheckPassed: boolean | string | null;
    DeceasedIndicator: boolean | string | null;
    FraudIndicator: boolean | string | null;
    CreditVision: boolean | string | null;
    constructor(_data: Partial<ITrueLinkCreditReportType>);
    init(): void;
}
