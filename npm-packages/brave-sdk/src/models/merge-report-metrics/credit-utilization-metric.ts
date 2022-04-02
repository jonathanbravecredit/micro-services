import { MetricIds, MetricLabels } from '../../constants/transunion';
import { CreditUtilizationStatus } from '../../types';
import { TradeLinePartition } from '../merge-report/components/tradeline-partition';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';

export class CreditUtilizationMetric {
  tradelines: TradeLinePartition[] = [];
  constructor(private report: MergeReport) {
    this.tradelines = report.TrueLinkCreditReportType?.TradeLinePartition || [];
  }

  getMetric(): CreditReportMetric<number, CreditUtilizationStatus> {
    const perc = this.calculateCreditUtilization(this.tradelines);
    const status = this.mapUtilizationStatusToSnapshot(this.calculateCreditStatus(perc));
    return new CreditReportMetric(MetricIds.CreditUtilization, MetricLabels.CreditUtilization, perc, status);
  }

  getCreditUtilizationSnapshotStatus(tradelines: TradeLinePartition[]): { status: string; perc: number } {
    const perc = this.calculateCreditUtilization(tradelines);
    const status = this.mapUtilizationStatusToSnapshot(this.calculateCreditStatus(perc));
    return {
      status,
      perc,
    };
  }

  calculateCreditUtilization(tradelines: TradeLinePartition[]): number {
    const debtAmount = this.sumDebtAmount(tradelines);
    const totalAmount = this.sumTotalAmount(tradelines);
    const utilizationPerc = this.calcUtilzationPerc(debtAmount, totalAmount);
    return utilizationPerc;
  }

  sumDebtAmount(tradelines: TradeLinePartition[]): number {
    return tradelines.reduce<number>((a: number, partition: TradeLinePartition) => {
      const openClosed = partition.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() || '';
      const typeSymbol = partition.accountTypeSymbol?.toLowerCase() || '';
      const limit = +(partition.Tradeline?.GrantedTrade?.CreditLimit || 0);
      const currBal = +(partition.Tradeline.currentBalance || 0);
      const open = openClosed === 'o';
      if (!open) return a;
      if (typeSymbol !== 'r') return a;
      if (limit <= 0) return a;
      return a + +currBal;
    }, 0);
  }

  sumTotalAmount(tradelines: TradeLinePartition[]): number {
    return tradelines.reduce<number>((a: number, partition: TradeLinePartition) => {
      const openClosed = partition.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() || '';
      const typeSymbol = partition.accountTypeSymbol?.toLowerCase() || '';
      const limit = +(partition.Tradeline?.GrantedTrade?.CreditLimit || 0);
      const open = openClosed === 'o';
      if (!open) return a;
      if (typeSymbol !== 'r') return a;
      return a + limit;
    }, 0);
  }

  calcUtilzationPerc(debt: number, total: number): number {
    if (total === 0) return 0;
    return Math.floor((debt / total) * 100);
  }

  calculateCreditStatus(percetangeUtilization: number | string | undefined): string {
    if (percetangeUtilization === undefined) return 'closed';
    if (percetangeUtilization === '<1') return 'excellent';
    switch (true) {
      case percetangeUtilization! <= 9:
        return 'excellent';
      case percetangeUtilization! <= 29:
        return 'good';
      case percetangeUtilization! <= 49:
        return 'fair';
      case percetangeUtilization! <= 74:
        return 'poor';
      default:
        return 'verypoor';
    }
  }

  mapUtilizationStatusToSnapshot(status: string): CreditUtilizationStatus {
    const mapper: Record<string, CreditUtilizationStatus> = {
      verypoor: 'critical',
      poor: 'semicritical',
      fair: 'danger',
      good: 'normal',
      excellent: 'safe',
    };
    return mapper[status.toLowerCase()];
  }
}
