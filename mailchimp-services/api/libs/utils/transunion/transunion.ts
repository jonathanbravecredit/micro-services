import { TransunionInput } from '@bravecredit/brave-sdk/dist/types/graphql-api';
import {
  IMergeReport,
  ISubscriber,
  IBorrower,
  ITradeLinePartition,
  IPublicPartition,
  ITradelineSummary,
  IBorrowerAddress,
  IEmployer,
} from '@bravecredit/brave-sdk/dist/types/merge-report';
import { IVantageScore } from '@bravecredit/brave-sdk/dist/types/vantage-score';

export class TransunionUtil {
  id: string;
  report: IMergeReport;
  subscribers: ISubscriber[];
  borrowerRecords: IBorrower;
  employers: IEmployer[];
  tradelineRecordsSummary: ITradelineSummary | null;
  tradelineRecords: ITradeLinePartition[];
  publicRecords: IPublicPartition[];
  creditScore: number | null;
  disputedWithBrave: boolean = false;

  constructor(id: string, data: TransunionInput, disputed: boolean = false) {
    this.id = id;
    this.report = this.parseTransunionMergeReport(data);
    this.creditScore = this.parseCreditScore(data);
    this.subscribers = this.parseSubscriberRecords(this.report);
    this.borrowerRecords = this.parseBorrowerRecords(this.report);
    this.employers = this.parseEmployerRecords(this.report);
    this.tradelineRecordsSummary = this.report.TrueLinkCreditReportType?.Summary?.TradelineSummary || null;
    this.tradelineRecords = this.parseTradelineRecords(this.report);
    this.publicRecords = this.parsePublicRecords(this.report);
    this.disputedWithBrave = disputed;
  }

  get countNegativeAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.DerogatoryAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get totalNegativeAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.DerogatoryAccounts as number;
    return isNaN(value) ? 0 : value;
  }
  get totalAccounts(): number {
    return this.tradelineRecords.length;
  }
  get totalAddresses(): number {
    return this.currentAddresses.length + this.previousAddresses.length;
  }
  get totalEmployers(): number {
    return this.employers.length;
  }

  get totalNames(): number {
    if (!this.borrowerRecords?.BorrowerName) return 0;
    return this.borrowerRecords?.BorrowerName instanceof Array ? this.borrowerRecords?.BorrowerName.length : 1;
  }

  get currentAddresses(): IBorrowerAddress[] {
    if (!this.borrowerRecords.BorrowerAddress) return [];
    return this.borrowerRecords.BorrowerAddress instanceof Array
      ? this.borrowerRecords.BorrowerAddress
      : [this.borrowerRecords.BorrowerAddress];
  }

  get previousAddresses(): IBorrowerAddress[] {
    if (!this.borrowerRecords.PreviousAddress) return [];
    return this.borrowerRecords.PreviousAddress instanceof Array
      ? this.borrowerRecords.PreviousAddress
      : [this.borrowerRecords.PreviousAddress];
  }

  parseTransunionMergeReport(transunion: TransunionInput | null | undefined): IMergeReport {
    if (!transunion) return JSON.parse('{}');
    const fulfillMergeReport = transunion.fulfillMergeReport;
    const enrollMergeReport = transunion.enrollMergeReport;
    const serviceProductString = fulfillMergeReport
      ? fulfillMergeReport?.serviceProductObject || '{}'
      : enrollMergeReport?.serviceProductObject || '{}';
    const serviceProductObject: IMergeReport =
      typeof serviceProductString === 'string' ? JSON.parse(serviceProductString) : serviceProductString;
    return serviceProductObject ? serviceProductObject : ({} as IMergeReport);
  }

  parseCreditScore(transunion: TransunionInput): number | null {
    if (!transunion) return JSON.parse('{}');
    const fulfill = transunion.fulfillVantageScore;
    const enroll = transunion.enrollVantageScore;
    const sps = fulfill ? fulfill?.serviceProductObject || '{}' : enroll?.serviceProductObject || '{}';
    const spo: IVantageScore = typeof sps === 'string' ? JSON.parse(sps) : sps;
    const riskScore = spo.CreditScoreType.riskScore;
    if (!riskScore) return 0;
    const value = +`${riskScore}`;
    if (isNaN(value)) return 0;
    return +value || 0;
  }

  parseTradelineRecords(report: IMergeReport): ITradeLinePartition[] {
    if (!report) return [];
    const partition = report.TrueLinkCreditReportType?.TradeLinePartition;
    if (partition instanceof Array) return partition;
    if (partition === undefined) return [];
    return [partition];
  }

  parseSubscriberRecords(report: IMergeReport): ISubscriber[] {
    const subscribers = report.TrueLinkCreditReportType?.Subscriber;
    if (subscribers instanceof Array) return subscribers;
    if (subscribers === undefined) return [];
    return [subscribers];
  }

  parseEmployerRecords(report: IMergeReport): IEmployer[] {
    const employer = report.TrueLinkCreditReportType?.Borrower?.Employer;
    if (!employer) return [];
    return employer instanceof Array ? employer : [employer];
  }
  parseBorrowerRecords(report: IMergeReport): IBorrower {
    return report.TrueLinkCreditReportType?.Borrower || ({} as IBorrower);
  }

  parsePublicRecords(report: IMergeReport): IPublicPartition[] {
    if (!report) return [];
    const partition = report.TrueLinkCreditReportType?.PulblicRecordPartition;
    if (partition instanceof Array) return partition;
    if (partition === undefined) return [];
    return [partition];
  }

  countStudenLoans(): number {
    if (!this.tradelineRecords || !this.tradelineRecords.length) return 0;
    return this.tradelineRecords.reduce((a, b) => {
      const symbol = b.Tradeline?.GrantedTrade?.AccountType?.symbol;
      if (!symbol || !isNaN(+symbol)) return a + 0;
      const symStr = (symbol as string).toLowerCase();
      return symStr === 'st' || symStr === 'educ' ? a + 1 : a + 0;
    }, 0);
  }

  countMortgages(): number {
    if (!this.tradelineRecords || !this.tradelineRecords.length) return 0;
    // TrueLinkCreditReportType > TradeLinePartition > AccountTypeDescription > Primary or secondary mortgage (M)
    return this.tradelineRecords.reduce((a, b) => {
      const isMortgage = b.accountTypeSymbol?.toLowerCase() === 'm';
      return isMortgage ? a + 1 : a + 0;
    }, 0);
  }

  countAutoLoan(): number {
    if (!this.tradelineRecords || !this.tradelineRecords.length) return 0;
    // TrueLinkCreditReportType > TradeLinePartition > AccountTypeDescription > Primary or secondary mortgage (M)
    return this.tradelineRecords.reduce((a, b) => {
      const symbol = b.Tradeline?.GrantedTrade?.AccountType?.symbol;
      if (!symbol || !isNaN(+symbol)) return a + 0;
      const symStr = (symbol as string).toLowerCase();
      const isAutoLoan = symStr === 'al' || symStr === 'ar' || symStr === 'at' || symStr === 'au';
      return isAutoLoan ? a + 1 : a + 0;
    }, 0);
  }

  countCollectionAccounts(): number {
    if (!this.tradelineRecords || !this.tradelineRecords.length) return 0;
    // TrueLinkCreditReportType > TradeLinePartition > AccountTypeDescription > Primary or secondary mortgage (M)
    return this.tradelineRecords.reduce((a, b) => {
      const isCollections = b.accountTypeSymbol?.toLowerCase() === 'y';
      return isCollections ? a + 1 : a + 0;
    }, 0);
  }
}
