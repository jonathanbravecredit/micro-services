import { TransunionInput, UserAttributesInput } from 'lib/aws/api.service';
import {
  IBorrower,
  IMergeReport,
  IPublicPartition,
  IPublicRecordSummary,
  ISubscriber,
  ITradeLinePartition,
  ITradelineSummary,
} from 'lib/interfaces/api/mergereport/mergereport.interface';

export class UserSummary {
  id: string;
  user: UserAttributesInput | null | undefined;
  report: IMergeReport;
  subscribers: ISubscriber[];
  borrowerRecords: IBorrower;
  tradelineRecordsSummary: ITradelineSummary | null;
  tradelineRecords: ITradeLinePartition[];
  publicRecordsSummary: IPublicRecordSummary | null;
  publicRecords: IPublicPartition[];
  creditScore: number | null;
  disputedWithBrave: boolean = false;

  constructor(
    id: string,
    user: UserAttributesInput | null | undefined,
    data: TransunionInput,
    disputed: boolean = false,
  ) {
    this.id = id;
    this.user = user;
    this.report = this.parseTransunionMergeReport(data);
    this.creditScore = this.parseCreditScore(this.report);
    this.subscribers = this.parseSubscriberRecords(this.report);
    this.borrowerRecords = this.parseBorrowerRecords(this.report);
    this.tradelineRecordsSummary = this.report.TrueLinkCreditReportType?.Summary?.TradelineSummary || null;
    this.tradelineRecords = this.parseTradelineRecords(this.report);
    this.publicRecordsSummary = this.report.TrueLinkCreditReportType?.Summary?.PublicRecordSummary || null;
    this.publicRecords = this.parsePublicRecords(this.report);
    this.disputedWithBrave = disputed;
  }

  get countOpenAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenAccounts}`
      : 0;
  }

  get sumBalances(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalBalances}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalBalances}`
      : 0;
  }

  get countDerogatoryAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.DerogatoryAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.DerogatoryAccounts}`
      : 0;
  }

  get countPublicRecordAccounts(): number {
    return !isNaN(+`${this.publicRecordsSummary?.Transunion?.NumberOfRecords}`)
      ? +`${this.publicRecordsSummary?.Transunion?.NumberOfRecords}`
      : 0;
  }

  get ageOfOldestTradeline(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.AgeofCredit}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.AgeofCredit}`
      : -1;
  }

  get countOpenInstallmentAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenInstallmentAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenInstallmentAccounts}`
      : 0;
  }

  get sumOpenInstallmentBalances(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalInstallmentAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalInstallmentAccounts}`
      : 0;
  }

  get countOpenStudentLoanAccounts(): number {
    return this.countOpenStudenLoans(this.tradelineRecords) || 0;
  }

  get sumStudentLoanBalance(): number {
    return this.sumOpenStudentLoans(this.tradelineRecords) || 0;
  }

  get countOpenRealEstateAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenMortgageAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenMortgageAccounts}`
      : 0;
  }

  get sumOpenRealEstateBalance(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalMortgageAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalMortgageAccounts}`
      : 0;
  }

  get countOpenRevolvingAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenRevolvingAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenRevolvingAccounts}`
      : 0;
  }

  get sumOpenRevolvingBalances(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalRevolvingAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalRevolvingAccounts}`
      : 0;
  }

  get countOpenCollectionAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenCollectionAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenCollectionAccounts}`
      : 0;
  }

  get sumOpenCollectionBalances(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalCollectionAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalCollectionAccounts}`
      : 0;
  }

  get countOpenOtherAccounts(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.OpenOtherAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.OpenOtherAccounts}`
      : 0;
  }
  get sumOpenOtherBalances(): number {
    return !isNaN(+`${this.tradelineRecordsSummary?.Transunion?.TotalOtherAccounts}`)
      ? +`${this.tradelineRecordsSummary?.Transunion?.TotalOtherAccounts}`
      : 0;
  }

  parseTransunionMergeReport(transunion: TransunionInput | null | undefined): IMergeReport {
    if (!transunion) return JSON.parse('{}');
    const fulfillMergeReport = transunion.fulfillMergeReport;
    const enrollMergeReport = transunion.enrollMergeReport;
    const serviceProductString = fulfillMergeReport
      ? fulfillMergeReport?.serviceProductObject || '{}'
      : enrollMergeReport?.serviceProductObject || '{}';
    const serviceProductObject: IMergeReport = JSON.parse(serviceProductString);
    return serviceProductObject ? serviceProductObject : ({} as IMergeReport);
  }

  parseCreditScore(report: IMergeReport): number | null {
    if (!report) return null;
    const creditScore = report.TrueLinkCreditReportType?.Borrower?.CreditScore;
    const riskScore = creditScore instanceof Array ? creditScore[0].riskScore || null : creditScore?.riskScore || null;
    const value = +`${riskScore}`;
    if (isNaN(value)) return 0;
    return +value || 0;
  }

  parseTradelineRecords(report: IMergeReport): ITradeLinePartition[] {
    if (!report) return [];
    const partition = report.TrueLinkCreditReportType?.TradeLinePartition;
    if (partition === undefined) return [];
    if (partition instanceof Array) {
      return partition;
    } else {
      return [partition];
    }
  }

  parseSubscriberRecords(report: IMergeReport): ISubscriber[] {
    const subscribers = report.TrueLinkCreditReportType?.Subscriber;
    if (subscribers instanceof Array) return subscribers;
    if (subscribers === undefined) return [];
    return [subscribers];
  }

  parseBorrowerRecords(report: IMergeReport): IBorrower {
    return report.TrueLinkCreditReportType?.Borrower || ({} as IBorrower);
  }

  parsePublicRecords(report: IMergeReport): IPublicPartition[] {
    if (!report) return [];
    const partition = report.TrueLinkCreditReportType.PulblicRecordPartition;
    if (partition instanceof Array) {
      return partition;
    } else {
      return partition ? [partition] : [];
    }
  }

  countOpenStudenLoans(partitions: ITradeLinePartition[] = []): number {
    if (!partitions || !partitions.length) return 0;
    return (
      partitions.filter((a) => {
        if (a.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() !== 'o') return false;
        const symbol = a.Tradeline?.GrantedTrade?.AccountType?.symbol || null;
        return symbol && (`${symbol}`.toLowerCase() === 'st' || `${symbol}`.toLowerCase() === 'educ');
      }).length || 0
    );
  }

  sumOpenStudentLoans(partitions: ITradeLinePartition[] = []): number {
    if (!partitions || !partitions.length) return 0;
    const studentloans = partitions.filter((a) => {
      if (a.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() !== 'o') return false;
      const symbol = a.Tradeline?.GrantedTrade?.AccountType?.symbol || null;
      return symbol && (`${symbol}`.toLowerCase() === 'st' || `${symbol}`.toLowerCase() === 'educ');
    });
    return studentloans
      .map((a) => (!isNaN(+`${a.Tradeline?.currentBalance}`) ? +`${a.Tradeline?.currentBalance}` : 0))
      .reduce((a, b) => {
        return a + b;
      }, 0);
  }
}
