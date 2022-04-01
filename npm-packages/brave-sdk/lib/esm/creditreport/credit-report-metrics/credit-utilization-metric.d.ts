import { CreditUtilizationStatus } from '../../_types/credit-report-metrics';
import { ITradeLinePartition } from '../../_types/merge-report';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditUtilizationMetric {
    private report;
    tradelines: ITradeLinePartition[];
    constructor(report: MergeReport);
    getMetric(): CreditReportMetric<number, CreditUtilizationStatus>;
    getCreditUtilizationSnapshotStatus(tradelines: ITradeLinePartition[]): {
        status: string;
        perc: number;
    };
    calculateCreditUtilization(tradelines: ITradeLinePartition[]): number;
    sumDebtAmount(tradelines: ITradeLinePartition[]): number;
    sumTotalAmount(tradelines: ITradeLinePartition[]): number;
    calcUtilzationPerc(debt: number, total: number): number;
    calculateCreditStatus(percetangeUtilization: number | string | undefined): string;
    mapUtilizationStatusToSnapshot(status: string): CreditUtilizationStatus;
}
