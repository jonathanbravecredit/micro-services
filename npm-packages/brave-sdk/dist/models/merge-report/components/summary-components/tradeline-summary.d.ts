import { ITradelineSummary, ITradelineSummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class TradelineSummary extends Homogenize<Partial<ITradelineSummary>> implements ITradelineSummary {
    Experian: ITradelineSummaryInfo;
    Equifax: ITradelineSummaryInfo;
    TransUnion: ITradelineSummaryInfo;
    Merge: ITradelineSummaryInfo;
    constructor(_data: Partial<ITradelineSummary>);
    init(): void;
}
