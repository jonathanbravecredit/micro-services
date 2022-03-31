import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  IMergeReport,
  ISubscriber,
  IBorrower,
  ITradelineSummary,
  ITradeLinePartition,
  IPublicRecordSummary,
  IPublicPartition,
  ICreditScore,
} from 'libs/interfaces/merge-report.interface';
import { CreditReport } from 'libs/models/CreditReport.model';
import { ICreditReportMetrics } from 'libs/interfaces/credit-report-metrics.interface';
import { Nested as _nest } from '@bravecredit/utilities';
import { NEGATIVE_PAY_STATUS_CODES } from 'libs/data/pay-status-codes';
import { AccountTypes, ACCOUNT_TYPES } from 'libs/data/account-types';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

export class CreditReportWithMetrics {
  id: string | null = null;
  userEnrolled = false;
  userReport: IMergeReport | null = null;
  subscribers: ISubscriber[] = [];
  borrowerRecords: IBorrower | null = null;
  tradelineRecordsSummary: ITradelineSummary | null = null;
  tradelineRecords: ITradeLinePartition[] = [];
  publicRecordsSummary: IPublicRecordSummary | null = null;
  publicRecords: IPublicPartition[] = [];
  creditScore: number | null = null;
  metrics: ICreditReportMetrics | null = null;

  constructor(public creditReport: CreditReport) {
    this.init();
  }
  init(): void {
    if (!Object.keys(this.creditReport).length) return;
    this.id = this.creditReport.userId;
    const { report } = this.creditReport;
    this.userReport = report;
    this.creditScore = this.parseCreditScore(report);
    this.subscribers = _nest.find<ISubscriber[]>(report, 'Subscriber') || [];
    this.borrowerRecords = _nest.find<IBorrower>(report, 'Borrower') || ({} as IBorrower);
    this.tradelineRecordsSummary =
      _nest.find<ITradelineSummary>(report, 'TradelineSummary') || ({} as ITradelineSummary);
    this.tradelineRecords = _nest.find<ITradeLinePartition[]>(report, 'TradeLinePartition') || [];
    this.publicRecordsSummary =
      _nest.find<IPublicRecordSummary>(report, 'PublicRecordSummary') || ({} as IPublicRecordSummary);
    this.publicRecords = _nest.find<IPublicPartition[]>(report, 'PulblicRecordPartition') || [];
    // this.aggregate(); // creates the report ready data on this.report
  }
  aggregate(): void {
    const data: ICreditReportMetrics = {
      userId: this.id,
      creditScore: this.creditScore || -1,
      countPublicRecordAccounts: this.countPublicRecordAccounts(),
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
      haveSelfLoan: false,
    };
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

    this.metrics = {
      ...data,
      haveSelfLoan: this.haveSelfLoans(),
    };
  }

  getAccountBalance(trade: ITradeLinePartition): number {
    const bal = trade?.Tradeline?.currentBalance || 0;
    return isNaN(+bal) ? 0 : +bal;
  }

  get totalAddresses(): number {
    const count =
      this.borrowerRecords?.BorrowerAddress?.length || 0 + (this.borrowerRecords?.PreviousAddress?.length || 0);
    return count;
  }

  get totalEmployers(): number {
    const count = this.borrowerRecords?.Employer.length || 0;
    return count;
  }

  get totalNames(): number {
    const count = this.borrowerRecords?.BorrowerName.length || 0;
    return count;
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
  parseCreditScore(report: IMergeReport): number | null {
    if (!report) return null;
    const creditScore = _nest.find<ICreditScore[]>(report, 'CreditScore') || [];
    const riskScore = creditScore.find((s) => s.scoreName?.toLowerCase() === 'vantagescore3');
    const value = +`${riskScore}`;
    if (isNaN(value)) return 0;
    return +value || 0;
  }
}
