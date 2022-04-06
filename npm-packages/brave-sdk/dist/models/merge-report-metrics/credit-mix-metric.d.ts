import { ICreditMixTLSummary, CreditMixStatus, IRecommendationText, IMergeReport } from '../../types';
import { ITradeLinePartition } from '../../types/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditMixMetric {
    private report;
    private _summary;
    constructor(report: IMergeReport);
    getMetric(): CreditReportMetric<string, CreditMixStatus>;
    get summary(): ICreditMixTLSummary;
    init(partitions: ITradeLinePartition[]): void;
    private condition1;
    private condition2;
    private condition3;
    private flagCreditCards;
    private flagOpenCreditCards;
    private flagMortgages;
    private flagOpenMortgages;
    private flagStudentLoans;
    private flagOpenStudentLoans;
    private flagAutoLoans;
    private flagOpenAutoLoans;
    getRatingsOnly(): IRecommendationText | undefined;
    getRecommendations(): IRecommendationText | undefined;
    private mapCreditMixSnapshotStatus;
}
export declare class CreditMixMetricSummaryMaker implements ICreditMixTLSummary {
    hasCreditCards: boolean;
    hasStudentLoans: boolean;
    hasAutoLoans: boolean;
    hasMortgages: boolean;
    hasOpenCreditCards: boolean;
    hasOpenStudentLoans: boolean;
    hasOpenAutoLoans: boolean;
    hasOpenMortgages: boolean;
    totalLineAmount: number;
    creditCardAmount: number;
    studentLoanAmount: number;
    autoLoanAmount: number;
    mortgageAmount: number;
    amountOfClosed: number;
    amountOfOpenCreditCards: number;
}
