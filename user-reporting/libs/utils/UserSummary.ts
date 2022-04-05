import { TransunionInput } from 'libs/interfaces/transunion.interfaces';
import {
  IBorrower,
  IMergeReport,
  IPublicPartition,
  IPublicRecordSummary,
  ISubscriber,
  ITradeLinePartition,
  ITradelineSummary,
} from 'libs/interfaces/merge-report.interfaces';
import { IAddress, IAppDataInput, IDob, IUser } from 'libs/interfaces/appdata.interfaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { IUserSummaryMappedValues } from 'libs/interfaces/user-summary.interfaces';
import { NEGATIVE_PAY_STATUS_CODES } from 'libs/data/pay-status-codes';
import { ACCOUNT_TYPES, AccountTypes } from 'libs/data/account-types';
import { getCurrentReport } from 'libs/queries/CreditReport.queries';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

export class UserSummary {
  id: string;
  user: IUser | null | undefined;
  userAge: number = -1;
  userDob: string = 'UNKNOWN';
  userState: string = 'UNKNOWN';
  userZip: string = 'UNKNOWN';
  userEnrolled: boolean = false;
  userReport!: IMergeReport;
  subscribers: ISubscriber[] = [];
  borrowerRecords!: IBorrower;
  tradelineRecordsSummary: ITradelineSummary | null = null;
  tradelineRecords: ITradeLinePartition[] = [];
  publicRecordsSummary: IPublicRecordSummary | null = null;
  publicRecords: IPublicPartition[] = [];
  creditScore: number | null = null;
  transunion: TransunionInput | null | undefined;
  report: IUserSummaryMappedValues = {} as IUserSummaryMappedValues;

  constructor(data: IAppDataInput) {
    this.id = data.id;
    this.user = data.user;
    this.transunion = data.agencies?.transunion;
    this.userEnrolled = data.agencies?.transunion?.enrolled || false;
  }

  get enrolledOn(): string {
    return this.transunion?.enrolledOn || '';
  }
  async init(): Promise<void> {
    console.log('id: ', this.id);
    let report;
    try {
      report = await getCurrentReport(this.id);
    } catch (err) {
      return;
    }
    console.log('report: ', report);
    if (!report || !report.report || !Object.keys(report.report).length) return;
    this.userReport = report.report;
    this.creditScore = this.parseCreditScore(this.userReport);
    this.subscribers = this.parseSubscriberRecords(this.userReport);
    this.borrowerRecords = this.parseBorrowerRecords(this.userReport);
    this.tradelineRecordsSummary = this.userReport.TrueLinkCreditReportType?.Summary?.TradelineSummary || null;
    this.tradelineRecords = this.parseTradelineRecords(this.userReport);
    this.publicRecordsSummary = this.userReport.TrueLinkCreditReportType?.Summary?.PublicRecordSummary || null;
    this.publicRecords = this.parsePublicRecords(this.userReport);
    this.setUserAddressValues(this.user?.userAttributes?.address);
    this.setUserDobValus(this.user?.userAttributes?.dob);
  }

  aggregate(): void {
    let data: IUserSummaryMappedValues = {
      userId: this.id,
      userAge: this.userAge || -1,
      userState: this.userState,
      userZipCode: this.userZip,
      creditScore: this.creditScore || -1,
      countPublicRecordAccounts: -1,
      countAllAccounts: 0,
      sumAllBalances: 0,
      countOpenAccounts: 0,
      sumOpenBalances: 0,
      countDerogatoryAccounts: 0,
      ageOfOldestTradeline: '9999-12-31',
      countOpenInstallmentAccounts: 0,
      sumOpenInstallmentBalances: 0,
      countOpenRealEstateAccounts: 0,
      sumOpenRealEstateBalances: 0,
      countOpenRevolvingAccounts: 0,
      sumOpenRevolvingBalances: 0,
      countOpenCollectionAccounts: 0,
      sumOpenCollectionBalances: 0,
      countOpenStudentLoanAccounts: 0,
      sumOpenStudentLoanBalances: 0,
      countOpenOtherAccounts: 0,
      sumOpenOtherBalances: 0,
      avgCreditLimit: -1,
      avgAgeRevolving: -1,
      avgTermLengthInstallment: -1,
      avgAPRInstallment: -1,
    };

    if (!this.userReport) {
      this.report = data;
      return;
    }

    this.tradelineRecords.forEach((trade) => {
      data.countAllAccounts++;
      data.sumAllBalances += this.getAccountBalance(trade);
      if (this.filterOpenAccounts(trade)) {
        data.countOpenAccounts++;
        data.sumOpenBalances += this.getAccountBalance(trade);
      }
      if (this.filterNegativeAccounts(trade)) {
        data.countDerogatoryAccounts++;
      }
      if (trade?.Tradeline?.dateOpened && dayjs(trade?.Tradeline?.dateOpened).isBefore(data.ageOfOldestTradeline)) {
        data.ageOfOldestTradeline = dayjs(trade.Tradeline?.dateOpened, 'YYYY-MM-DD').toISOString();
      }
      if (this.filterOpenInstallmentAccounts(trade)) {
        data.countOpenInstallmentAccounts++;
        data.sumOpenInstallmentBalances += this.getAccountBalance(trade);
      }
      if (this.filterOpenRealEstateAccounts(trade)) {
        data.countOpenRealEstateAccounts++;
        data.sumOpenRealEstateBalances += this.getAccountBalance(trade);
      }
      if (this.filterOpenRevolvingAccounts(trade)) {
        data.countOpenRevolvingAccounts++;
        data.sumOpenRevolvingBalances += this.getAccountBalance(trade);
      }
      if (this.filterOpenCollectionAccounts(trade)) {
        data.countOpenCollectionAccounts++;
        data.sumOpenCollectionBalances += this.getAccountBalance(trade);
      }
      if (this.filterOpenStudentLoanAccounts(trade)) {
        data.countOpenStudentLoanAccounts++;
        data.sumOpenStudentLoanBalances += this.getAccountBalance(trade);
      }
      if (this.filterOpenOtherAccounts(trade)) {
        data.countOpenOtherAccounts++;
        data.sumOpenOtherBalances += this.getAccountBalance(trade);
      }
    });
    data = {
      ...data,
      countPublicRecordAccounts: this.countPublicRecordAccounts() || -1,
      avgCreditLimit: this.avgCreditLimit() || -1,
      avgAgeRevolving: this.avgAgeRevolving() || -1,
      avgTermLengthInstallment: this.avgTermLength() || -1,
      avgAPRInstallment: this.avgAPRInstallment() || -1,
    };
    this.report = data;
  }

  getAccountBalance(trade: ITradeLinePartition): number {
    const bal = trade?.Tradeline?.currentBalance || 0;
    return isNaN(+bal) ? 0 : +bal;
  }

  setUserAddressValues(address: IAddress | null | undefined): void {
    if (!address) {
      this.userState = 'UNKNOWN';
      this.userZip = 'UNKNOWN';
      return;
    }
    this.userState = address.state || 'UNKNOWN';
    this.userZip = address.zip || 'UNKNOWN';
  }

  setUserDobValus(dob: IDob | null | undefined): void {
    if (!dob) {
      this.userDob = 'UNKNOWN';
      this.userAge = -1;
      return;
    }
    const today = dayjs(new Date()).hour(0).minute(0).second(0).millisecond(0);
    const { year, month, day } = dob;
    this.userDob = dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .format('YYYY-MM-DD');
    this.userAge = Math.floor(today.diff(this.userDob, 'hour') / 8760);
  }

  /*=============================*/
  //        filter/aggregators
  /*=============================*/
  filterOpenAccounts(trade: ITradeLinePartition): boolean {
    const symbol = trade?.Tradeline?.OpenClosed?.symbol?.toString() || '';
    return symbol.toLowerCase() === 'o';
  }

  filterNegativeAccounts(trade: ITradeLinePartition): boolean {
    const symbol = trade?.Tradeline?.PayStatus?.symbol || 'U';
    const neg = NEGATIVE_PAY_STATUS_CODES[symbol];
    return !!neg;
  }

  filterOpenByAccountType(trade: ITradeLinePartition, type: AccountTypes): boolean {
    if (trade.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() !== 'o') return false;
    const sym = trade.accountTypeSymbol?.toLowerCase() || '';
    return ACCOUNT_TYPES[sym] === type ? true : false;
  }

  filterOpenInstallmentAccounts(trade: ITradeLinePartition): boolean {
    return this.filterOpenByAccountType(trade, AccountTypes.Installment);
  }

  filterOpenRealEstateAccounts(trade: ITradeLinePartition): boolean {
    return this.filterOpenByAccountType(trade, AccountTypes.Mortgage);
  }

  filterOpenRevolvingAccounts(trade: ITradeLinePartition): boolean {
    return this.filterOpenByAccountType(trade, AccountTypes.Revolving);
  }

  filterOpenCollectionAccounts(trade: ITradeLinePartition): boolean {
    return this.filterOpenByAccountType(trade, AccountTypes.Collection);
  }

  filterOpenOtherAccounts(trade: ITradeLinePartition): boolean {
    if (!this.filterOpenAccounts(trade)) return false;
    if (
      this.filterOpenInstallmentAccounts(trade) ||
      this.filterOpenRealEstateAccounts(trade) ||
      this.filterOpenRevolvingAccounts(trade) ||
      this.filterOpenCollectionAccounts(trade)
    ) {
      return false;
    } else {
      return true;
    }
  }

  filterOpenStudentLoanAccounts(trade: ITradeLinePartition): boolean {
    if (trade.Tradeline?.OpenClosed?.symbol?.toString().toLowerCase() !== 'o') return false;
    const symbol = trade.Tradeline?.GrantedTrade?.AccountType?.symbol || null;
    return `${symbol}`.toLowerCase() === 'st' || `${symbol}`.toLowerCase() === 'educ';
  }

  countPublicRecordAccounts(): number {
    return this.publicRecords.length || 0;
  }

  avgCreditLimit(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenRevolvingAccounts.bind(this));
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const bal = b.Tradeline?.GrantedTrade?.CreditLimit || 0;
        return a + (isNaN(+bal) ? 0 : +bal);
      }, 0) / installs.length
    );
  }

  avgAgeRevolving(): number {
    const revolvings = this.tradelineRecords
      .filter(this.filterOpenRevolvingAccounts.bind(this))
      .filter((a) => a.Tradeline?.dateOpened && a.Tradeline?.dateClosed);
    if (!revolvings.length) return -1;
    return (
      revolvings.reduce((a, b) => {
        // const bal = b.Tradeline?.GrantedTrade?.CreditLimit || 0;
        const opened = b.Tradeline?.dateOpened;
        const closed = b.Tradeline?.dateClosed;
        if (!opened || !closed) return 0;
        const age = dayjs(opened, 'YYYY-MM-DD').diff(dayjs(closed, 'YYYY-MM-DD'), 'month');
        return a + age;
      }, 0) / revolvings.length
    );
  }

  avgTermLength(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenInstallmentAccounts.bind(this)).filter((a) => {
      const term = a.Tradeline?.GrantedTrade?.termMonths || 0;
      return (isNaN(+term) ? 0 : +term) > 0;
    });
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const terms = b.Tradeline?.GrantedTrade?.termMonths || 0;
        return a + (isNaN(+terms) ? 0 : +terms);
      }, 0) / installs.length
    );
  }

  avgAPRInstallment(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenInstallmentAccounts.bind(this)).filter((a) => {
      const apr = a.Tradeline?.GrantedTrade?.TermType?.rank || 0;
      return (isNaN(+apr) ? 0 : +apr) > 0;
    });
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const apr = b.Tradeline?.GrantedTrade?.TermType?.rank || 0;
        return a + (isNaN(+apr) ? 0 : +apr);
      }, 0) / installs.length
    );
  }
  /*=============================*/
  //        queries
  /*=============================*/
  haveSelfLoans(): boolean {
    return !!this.subscribers.find((s) => {
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
        case 'atlantic cap bkselflendr':
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

  /*=============================*/
  //        parsers
  /*=============================*/
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

  parseTransunionEnrollMergeReport(transunion: TransunionInput | null | undefined): IMergeReport {
    if (!transunion) return JSON.parse('{}');
    const enrollMergeReport = transunion.enrollMergeReport;
    const serviceProductString = enrollMergeReport ? enrollMergeReport?.serviceProductObject : '{}';
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
}
