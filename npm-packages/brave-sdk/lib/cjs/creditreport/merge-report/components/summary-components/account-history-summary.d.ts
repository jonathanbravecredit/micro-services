import { IAccountHistorySummary, IAccountHistorySummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class AccountHistorySummary extends Homogenize<Partial<IAccountHistorySummary>> implements IAccountHistorySummary {
    TransUnion: IAccountHistorySummaryInfo;
    constructor(_data: Partial<IAccountHistorySummary>);
    init(): void;
}
