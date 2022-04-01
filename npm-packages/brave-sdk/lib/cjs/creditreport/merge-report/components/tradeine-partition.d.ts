import { ITradeLinePartition, ITradeline } from '../../../_types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class TradeLinePartition extends Homogenize<Partial<ITradeLinePartition>> implements ITradeLinePartition {
    Tradeline: ITradeline;
    accountTypeDescription: string | null;
    accountTypeSymbol: string | null;
    accountTypeAbbreviation: string | null;
    constructor(_data: Partial<ITradeLinePartition>);
    init(): void;
}
