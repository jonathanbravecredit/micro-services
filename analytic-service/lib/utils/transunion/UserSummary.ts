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
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get sumBalances(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalBalances as number;
    return isNaN(value) ? 0 : value;
  }

  get countDerogatoryAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.DerogatoryAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get countPublicRecordAccounts(): number {
    const value = this.publicRecordsSummary?.Transunion?.NumberOfRecords as number;
    return isNaN(value) ? 0 : value;
  }

  get ageOfOldestTradeline(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.AgeofCredit as number;
    return isNaN(value) ? -1 : value;
  }

  get countOpenInstallmentAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenInstallmentAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get sumOpenInstallmentBalances(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalInstallmentAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get countOpenStudentLoanAccounts(): number {
    return this.countOpenStudenLoans(this.tradelineRecords) || 0;
  }

  get sumStudentLoanBalance(): number {
    return this.sumOpenStudentLoans(this.tradelineRecords) || 0;
  }

  get countOpenRealEstateAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenMortgageAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get sumOpenRealEstateBalance(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalMortgageAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get countOpenRevolvingAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenRevolvingAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get sumOpenRevolvingBalances(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalRevolvingAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get countOpenCollectionAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenCollectionAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get sumOpenCollectionBalances(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalCollectionAccounts as number;
    return isNaN(value) ? 0 : value;
  }

  get countOpenOtherAccounts(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.OpenOtherAccounts as number;
    return isNaN(value) ? 0 : value;
  }
  get sumOpenOtherBalances(): number {
    const value = this.tradelineRecordsSummary?.TransUnion?.TotalOtherAccounts as number;
    return isNaN(value) ? 0 : value;
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
    const partition = report.TrueLinkCreditReportType?.PulblicRecordPartition;
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

  haveSelfLoans(report: IMergeReport): boolean {
    const subscribers = this.parseSubscriberRecords(report);
    if (!subscribers || !subscribers.length) return false;
    return !!subscribers.find((s) => {
      const name = s.name?.toLowerCase();
      if (!name) return;
      let found = false;
      switch (name) {
        case 'sbnaselflndr':
          found = true;
          break;
        case 'ftself lender inc.':
          found = true;
          break;
        case 'lead bank':
          found = true;
          break;
        case 'sf lead bank':
          found = true;
          break;
        case 'sf/lead bank':
          found = true;
          break;
        case 'atlantic cap bkselflender':
          found = true;
          break;
        case 'atlantic capital bank self':
          found = true;
          break;
        case 'sbna self':
          found = true;
          break;
        default:
          break;
      }
      return found;
    });
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
