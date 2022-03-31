import { Nested as _nest } from '../../../nested/nested';
import {
  CreditMixRecommendations as Recs,
  RecommendationValues as Values,
  RecommendationConditionalLogic as Logic,
} from '../../../_constants/transunion';
import {
  CreditMixStatus,
  ICreditMixTLSummary,
  IRecommendationText,
  MetricIds,
  MetricLabels,
} from '../../../_types/credit-report-metrics';
import { ITradeLinePartition } from '../../../_types/merge-report';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';

export class CreditMixMetric {
  private _summary: ICreditMixTLSummary = new CreditMixMetricSummaryMaker();
  constructor(private report: MergeReport) {
    this.init(report.TrueLinkCreditReportType.TradeLinePartition || []);
  }

  getMetric(): CreditReportMetric<string, CreditMixStatus> {
    const { rating = '' } = this.getRatingsOnly() || {};
    const status = this.mapCreditMixSnapshotStatus(rating);
    return new CreditReportMetric(MetricIds.CreditUtilization, MetricLabels.CreditUtilization, rating, status);
  }

  get summary(): ICreditMixTLSummary {
    return this._summary;
  }

  init(partitions: ITradeLinePartition[]): void {
    partitions.forEach((tradeline) => {
      const openClosed = tradeline.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() || '';
      const typeSymbol = tradeline.accountTypeSymbol?.toLowerCase() || '';
      const tradeSymbol = tradeline.Tradeline?.GrantedTrade?.AccountType?.symbol?.toString().toLowerCase() || '';
      const open = openClosed === 'o';
      this.condition1(open);
      this.condition2(open, typeSymbol);
      this.condition3(open, tradeSymbol);
    });
  }

  private condition1(open: boolean): void {
    if (!open) this.summary.amountOfClosed += 1;
    this.summary.totalLineAmount += 1;
  }
  private condition2(open: boolean, type: string): void {
    if (type === 'r') this.flagCreditCards(open);
    if (type === 'm') this.flagMortgages(open);
  }
  private condition3(open: boolean, type: string): void {
    if (type === 'st' || type === 'educ') this.flagStudentLoans(open);
    else if (type === 'al' || type === 'ar' || type === 'at' || type === 'au') this.flagAutoLoans(open);
  }

  private flagCreditCards(open: boolean): void {
    if (open) this.flagOpenCreditCards();
    this.summary.hasCreditCards = true;
    this.summary.creditCardAmount += 1;
  }
  private flagOpenCreditCards(): void {
    this.summary.hasOpenCreditCards = true;
    this.summary.amountOfOpenCreditCards += 1;
  }

  private flagMortgages(open: boolean): void {
    if (open) this.flagOpenMortgages();
    this.summary.hasMortgages = true;
    this.summary.mortgageAmount += 1;
  }

  private flagOpenMortgages(): void {
    this.summary.hasOpenMortgages = true;
  }

  private flagStudentLoans(open: boolean): void {
    if (open) this.flagOpenStudentLoans();
    this.summary.hasStudentLoans = true;
    this.summary.studentLoanAmount += 1;
  }

  private flagOpenStudentLoans(): void {
    this.summary.hasOpenStudentLoans = true;
  }

  private flagAutoLoans(open: boolean): void {
    if (open) this.flagOpenAutoLoans();
    this.summary.hasAutoLoans = true;
    this.summary.autoLoanAmount += 1;
  }

  private flagOpenAutoLoans(): void {
    this.summary.hasOpenAutoLoans = true;
  }

  getRatingsOnly(): IRecommendationText | undefined {
    const recs = Object.values(Recs);
    for (let i = 0; i < recs.length; i++) {
      if (Logic[recs[i]](this.summary)) {
        const { rating, color } = Values[recs[i]];
        return {
          rating,
          color,
        };
      }
    }
  }

  getRecommendations(): IRecommendationText | undefined {
    const recs = Object.values(Recs);
    for (let i = 0; i < recs.length; i++) {
      if (Logic[recs[i]](this.summary)) {
        return Values[recs[i]];
      }
    }
  }

  private mapCreditMixSnapshotStatus(status: string): CreditMixStatus {
    const mapper: Record<string, CreditMixStatus> = {
      poor: 'semicritical',
      fair: 'danger',
      good: 'normal',
      excellent: 'safe',
    };
    return mapper[status.toLowerCase()];
  }
}

export class CreditMixMetricSummaryMaker implements ICreditMixTLSummary {
  hasCreditCards = false;
  hasStudentLoans = false;
  hasAutoLoans = false;
  hasMortgages = false;
  hasOpenCreditCards = false;
  hasOpenStudentLoans = false;
  hasOpenAutoLoans = false;
  hasOpenMortgages = false;
  totalLineAmount = 0;
  creditCardAmount = 0;
  studentLoanAmount = 0;
  autoLoanAmount = 0;
  mortgageAmount = 0;
  amountOfClosed = 0;
  amountOfOpenCreditCards = 0;
}
