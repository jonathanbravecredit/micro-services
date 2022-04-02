import { ISourceSummary } from '../../../types/common-tu';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { SourceSummary } from '../common/source-summary';
import { BankingPartition } from './banking-partition';
import { Borrower } from './borrower';
import { InquiryPartition } from './inquiry-partition';
import { Message } from './message';
import { PublicPartition } from './public-partition';
import { Subscriber } from './subscriber';
import { Summary } from './summary';
import { TradeLinePartition } from './tradeline-partition';
import { SB168Frozen } from './SB168-frozen';

export class TrueLinkCreditReportType extends Homogenize<Partial<TrueLinkCreditReportType>> {
  SB168Frozen!: SB168Frozen;
  Borrower!: Borrower;
  TradeLinePartition: TradeLinePartition[] = [];
  InquiryPartition: InquiryPartition[] = [];
  BankingRecordPartition: BankingPartition[] = [];
  PulblicRecordPartition: PublicPartition[] = [];
  Subscriber: Subscriber[] = [];
  Message: Message[] = [];
  Summary!: Summary;
  Sources: SourceSummary[] = [];

  SafetyCheckPassed: boolean | string | null = null;
  DeceasedIndicator: boolean | string | null = null;
  FraudIndicator: boolean | string | null = null;
  CreditVision: boolean | string | null = null;

  constructor(_data: Partial<TrueLinkCreditReportType>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SB168Frozen = new SB168Frozen(this.SB168Frozen);
    this.Borrower = new Borrower(this.Borrower);
    this.TradeLinePartition = this.homogenizeArray<TradeLinePartition, TradeLinePartition>(
      this.TradeLinePartition,
      TradeLinePartition,
    );
    this.InquiryPartition = this.homogenizeArray<InquiryPartition, InquiryPartition>(
      this.InquiryPartition,
      InquiryPartition,
    );
    this.BankingRecordPartition = this.homogenizeArray<BankingPartition, BankingPartition>(
      this.BankingRecordPartition,
      BankingPartition,
    );
    this.PulblicRecordPartition = this.homogenizeArray<PublicPartition, PublicPartition>(
      this.PulblicRecordPartition,
      PublicPartition,
    );
    this.Subscriber = this.homogenizeArray<Subscriber, Subscriber>(this.Subscriber, Subscriber);
    this.Message = this.homogenizeArray<Message, Message>(this.Message, Message);
    this.Summary = new Summary(this.Summary);
    this.Sources = this.homogenizeArray<ISourceSummary, SourceSummary>(this.Sources, SourceSummary);
  }
}
