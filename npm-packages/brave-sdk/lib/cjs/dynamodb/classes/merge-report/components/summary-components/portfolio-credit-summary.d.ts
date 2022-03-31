import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class PortfolioCreditSummary extends Homogenize<Partial<IPortfolioCreditSummary>> implements IPortfolioCreditSummary {
    TransUnion: IPortfolioCreditSummaryInfo;
    constructor(_data: Partial<IPortfolioCreditSummary>);
    init(): void;
}
