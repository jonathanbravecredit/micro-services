import { ISourceSummary } from '../../../types';
import {
  ITrueLinkCreditReportType,
  ISB168Frozen,
  IBorrower,
  ITradeLinePartition,
  IInquiryPartition,
  IBankingPartition,
  IPublicPartition,
  ISubscriber,
  IMessage,
  ISummary,
} from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { SourceSummary } from '../common/source-summary';
import { BankingPartition } from './banking-partition';
import { Borrower } from './borrower';
import { InquiryPartition } from './inquiry-partition';
import { Message } from './message';
import { PublicPartition } from './public-partition';
import { SB168Frozen } from './SB168-frozen';
import { Subscriber } from './subscriber';
import { Summary } from './summary';
import { TradeLinePartition } from './tradeline-partition';

export class TrueLinkCreditReportType
  extends Homogenize<Partial<ITrueLinkCreditReportType>>
  implements ITrueLinkCreditReportType
{
  SB168Frozen!: ISB168Frozen;
  Borrower!: IBorrower;
  TradeLinePartition: ITradeLinePartition[] = [];
  InquiryPartition: IInquiryPartition[] = [];
  BankingRecordPartition: IBankingPartition[] = [];
  PulblicRecordPartition: IPublicPartition[] = [];
  Subscriber: ISubscriber[] = [];
  Message: IMessage[] = [];
  Summary!: ISummary;
  Sources: ISourceSummary[] = [];

  SafetyCheckPassed: boolean | string | null = null;
  DeceasedIndicator: boolean | string | null = null;
  FraudIndicator: boolean | string | null = null;
  CreditVision: boolean | string | null = null;

  constructor(_data: Partial<ITrueLinkCreditReportType>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SB168Frozen = new SB168Frozen(this.SB168Frozen);
    this.Borrower = new Borrower(this.Borrower);
    this.TradeLinePartition = this.homogenizeArray<ITradeLinePartition, TradeLinePartition>(
      this.TradeLinePartition,
      TradeLinePartition,
    );
    this.InquiryPartition = this.homogenizeArray<IInquiryPartition, InquiryPartition>(
      this.InquiryPartition,
      InquiryPartition,
    );
    this.BankingRecordPartition = this.homogenizeArray<IBankingPartition, BankingPartition>(
      this.BankingRecordPartition,
      BankingPartition,
    );
    this.PulblicRecordPartition = this.homogenizeArray<IPublicPartition, PublicPartition>(
      this.PulblicRecordPartition,
      PublicPartition,
    );
    this.Subscriber = this.homogenizeArray<ISubscriber, Subscriber>(this.Subscriber, Subscriber);
    this.Message = this.homogenizeArray<IMessage, Message>(this.Message, Message);
    this.Summary = new Summary(this.Summary);
    this.Sources = this.homogenizeArray<ISourceSummary, SourceSummary>(this.Sources, SourceSummary);
  }
}
