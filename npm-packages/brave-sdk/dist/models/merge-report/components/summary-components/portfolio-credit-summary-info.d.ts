import { ICodeRef } from '../../../../types';
import { IPortfolioCreditSummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PortfolioCreditSummaryInfo extends Homogenize<Partial<IPortfolioCreditSummaryInfo>> implements IPortfolioCreditSummaryInfo {
    SummaryType: ICodeRef;
    CurrentPaymentDueAmount: number | string | null;
    PriorPaymentDueAmount: number | string | null;
    CurrentActualPaymentAmount: number | string | null;
    PastDueAmount: number | string | null;
    CreditLimitAmount: number | string | null;
    BalanceAmount: number | string | null;
    constructor(_data: Partial<IPortfolioCreditSummaryInfo>);
    init(): void;
}
