import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PortfolioCreditSummary extends Homogenize<Partial<IPortfolioCreditSummary>> implements IPortfolioCreditSummary {
    TransUnion: IPortfolioCreditSummaryInfo;
    constructor(_data: Partial<IPortfolioCreditSummary>);
    init(): void;
}
