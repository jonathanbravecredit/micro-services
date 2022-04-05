import { ICodeRef } from '../../../../types';
import { IAccountHistorySummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class AccountHistorySummaryInfo extends Homogenize<Partial<IAccountHistorySummaryInfo>> implements IAccountHistorySummaryInfo {
    SummaryType: ICodeRef;
    TotalPaymentRatio: number | string | null;
    ActualPaymentAmount: number | string | null;
    PaymentDueAmount: number | string | null;
    TransactorRevolverIndicator: string | null;
    EndingBalanceAmount: number | string | null;
    AggregateExcessPaymentAmount: number | string | null;
    ActiveAccounts: number | string | null;
    OpenAccounts: number | string | null;
    TimePeriod: string | null;
    EstimatedSpendAmount: number | string | null;
    PriorMonthBalance: number | string | null;
    CreditLimitAmount: number | string | null;
    constructor(_data: Partial<IAccountHistorySummaryInfo>);
    init(): void;
}
