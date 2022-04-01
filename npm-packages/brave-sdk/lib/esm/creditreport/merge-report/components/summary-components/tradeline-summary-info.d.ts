import { ICodeRef } from '../../../../_types/common-tu';
import { ITradelineSummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class TradelineSummaryInfo extends Homogenize<Partial<ITradelineSummaryInfo>> implements ITradelineSummaryInfo {
    RecentDeliquencyMOP: ICodeRef;
    TotalHistoricalNegatives: number | string | null;
    OpenCollectionAccounts: number | string | null;
    TotalCollectionAccounts: number | string | null;
    HistoricalNegativeAccounts: number | string | null;
    TotalInstallmentAccounts: number | string | null;
    OpenInstallmentAccounts: number | string | null;
    TotalOtherAccounts: number | string | null;
    OpenOtherAccounts: number | string | null;
    OpenMortgageAccounts: number | string | null;
    RecentDeliquencyDate: string | null;
    TotalMortgageAccounts: number | string | null;
    DelinquentAccounts: number | string | null;
    DerogatoryAccounts: number | string | null;
    CloseAccounts: number | string | null;
    TotalAccounts: number | string | null;
    OpenAccounts: number | string | null;
    TotalRevolvingAccounts: number | string | null;
    OpenRevolvingAccounts: number | string | null;
    CreditSummaryPeriod: string | null;
    TotalBalances: number | string | null;
    TotalMonthlyPayments: number | string | null;
    AgeofCredit: number | string | null;
    constructor(_data: Partial<ITradelineSummaryInfo>);
    init(): void;
}
