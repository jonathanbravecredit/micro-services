import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { IUserSummaryMappedValues } from 'libs/interfaces/user-summary.interfaces';
import {
  AccountTypes,
  ACCOUNT_TYPES,
  NEGATIVE_PAY_STATUS_CODES,
} from '@bravecredit/brave-sdk/dist/constants/transunion';
import { AddressInput, CreditReportQueries, IMergeReport, UpdateAppDataInput, UserInput } from '@bravecredit/brave-sdk';
import { DobInput, TransunionInput } from '@bravecredit/brave-sdk/dist/types/graphql-api';
import {
  IBorrower,
  IPublicPartition,
  IPublicRecordSummary,
  ISubscriber,
  ITradeLinePartition,
  ITradelineSummary,
} from '@bravecredit/brave-sdk/dist/types/merge-report';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

export class UserSummary {
  id: string;
  user: UserInput | null | undefined;
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

  constructor(data: UpdateAppDataInput) {
    this.id = data.id;
    this.user = data.user;
    this.transunion = data.agencies?.transunion;
    this.userEnrolled = data.agencies?.transunion?.enrolled || false;
  }

  get enrolledOn(): string {
    return this.transunion?.enrolledOn || '';
  }
  async init(): Promise<void> {
    let report;
    try {
      report = await CreditReportQueries.getCurrentReport(this.id);
    } catch (err) {
      return;
    }
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
      avgTermLengthLOC: -1,
      avgTermLengthInstallments: -1,
      avgTermLengthMortgage: -1,
      avgTermLengthStudentLoan: -1,
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
      avgTermLengthLOC: this.avgTermLengthLOC() || -1,
      avgTermLengthInstallments: this.avgTermLengthInstallments() || -1,
      avgTermLengthMortgage: this.avgTermLengthMortgages() || -1,
      avgTermLengthStudentLoan: this.avgTermLengthStudentLoans() || -1,
    };
    this.report = data;
  }

  getAccountBalance(trade: ITradeLinePartition): number {
    const bal = trade?.Tradeline?.currentBalance || 0;
    return isNaN(+bal) ? 0 : +bal;
  }

  setUserAddressValues(address: AddressInput | null | undefined): void {
    if (!address) {
      this.userState = 'UNKNOWN';
      this.userZip = 'UNKNOWN';
      return;
    }
    this.userState = address.state || 'UNKNOWN';
    this.userZip = address.zip || 'UNKNOWN';
  }

  setUserDobValus(dob: DobInput | null | undefined): void {
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
  filterOpenLOCAccounts(trade: ITradeLinePartition): boolean {
    return this.filterOpenByAccountType(trade, AccountTypes.LineOfCredit);
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
    const revolvings = this.tradelineRecords.filter(this.filterOpenRevolvingAccounts.bind(this)).filter((a) => {
      return a.Tradeline?.dateOpened;
    });
    if (!revolvings.length) return -1;
    return (
      revolvings.reduce((a, b) => {
        const opened = b.Tradeline?.dateOpened;
        if (!opened) return 0;
        const age = dayjs(new Date()).diff(dayjs(opened, 'YYYY-MM-DD'), 'months');
        return a + age;
      }, 0) / revolvings.length
    );
  }

  avgTermLengthLOC(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenLOCAccounts.bind(this));
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const terms = b.Tradeline?.GrantedTrade?.termMonths || 0;
        return a + (isNaN(+terms) ? 0 : +terms);
      }, 0) / installs.length
    );
  }

  avgTermLengthInstallments(): number {
    const installs = this.tradelineRecords.filter((a) => {
      if (!this.filterOpenInstallmentAccounts(a)) return false;
      if (this.filterOpenRealEstateAccounts(a)) return false;
      if (this.filterOpenStudentLoanAccounts(a)) return false;
      return true;
    });
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const terms = b.Tradeline?.GrantedTrade?.termMonths || 0;
        return a + (isNaN(+terms) ? 0 : +terms);
      }, 0) / installs.length
    );
  }

  avgTermLengthMortgages(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenRealEstateAccounts.bind(this));
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const terms = b.Tradeline?.GrantedTrade?.termMonths || 0;
        return a + (isNaN(+terms) ? 0 : +terms);
      }, 0) / installs.length
    );
  }

  avgTermLengthStudentLoans(): number {
    const installs = this.tradelineRecords.filter(this.filterOpenStudentLoanAccounts.bind(this));
    if (!installs.length) return -1;
    return (
      installs.reduce((a, b) => {
        const terms = b.Tradeline?.GrantedTrade?.termMonths || 0;
        return a + (isNaN(+terms) ? 0 : +terms);
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
    const riskScore = creditScore[0]?.riskScore || null;
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
