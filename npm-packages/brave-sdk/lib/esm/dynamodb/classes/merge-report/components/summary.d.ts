import { ISummary, ITradelineSummary, IInquirySummary, IPublicRecordSummary, IPortfolioCreditSummary, IAccountHistorySummary } from '../../../../_types/merge-report';
import { Homogenize } from '../../homogenize/homogenize-data';
export declare class Summary extends Homogenize<Partial<ISummary>> implements ISummary {
    TradelineSummary: ITradelineSummary;
    InquirySummary: IInquirySummary;
    PublicRecordSummary: IPublicRecordSummary;
    PortfolioCreditSummary: IPortfolioCreditSummary[];
    AccountHistorySummary: IAccountHistorySummary[];
    constructor(_data: Partial<ISummary>);
    init(): void;
}
