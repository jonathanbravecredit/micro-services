import { ISource, ISourceSummary } from "libs/interfaces/common.interface";
import {
  IBankingPartition,
  IBorrower,
  IInquiryPartition,
  IMessage,
  IPublicPartition,
  ISB168Frozen,
  ISubscriber,
  ISummary,
  ITradeLinePartition,
  ITrueLinkCreditReportType,
} from "@bravecredit/brave-sdk/dist/types/merge-report";
import { Homogenize } from "libs/utils/mergereport/Base/HomogenizeData";
import { SourceSummary } from "libs/utils/mergereport/Common/SourceSummary";
import { BankingPartition } from "libs/utils/mergereport/MergeReport/MergeReportComponents/BankingPartition";
import { Borrower } from "libs/utils/mergereport/MergeReport/MergeReportComponents/Borrower";
import { InquiryPartition } from "libs/utils/mergereport/MergeReport/MergeReportComponents/InquiryPartition";
import { Message } from "libs/utils/mergereport/MergeReport/MergeReportComponents/Message";
import { PublicPartition } from "libs/utils/mergereport/MergeReport/MergeReportComponents/PublicPartition";
import { SB168Frozen } from "libs/utils/mergereport/MergeReport/MergeReportComponents/SB168Frozen";
import { Subscriber } from "libs/utils/mergereport/MergeReport/MergeReportComponents/Subscriber";
import { Summary } from "libs/utils/mergereport/MergeReport/MergeReportComponents/Summary";
import { TradeLinePartition } from "libs/utils/mergereport/MergeReport/MergeReportComponents/TradeLinePartition";

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
    this.TradeLinePartition = this.homogenizeArray<
      ITradeLinePartition,
      TradeLinePartition
    >(this.TradeLinePartition, TradeLinePartition);
    this.InquiryPartition = this.homogenizeArray<
      IInquiryPartition,
      InquiryPartition
    >(this.InquiryPartition, InquiryPartition);
    this.BankingRecordPartition = this.homogenizeArray<
      IBankingPartition,
      BankingPartition
    >(this.BankingRecordPartition, BankingPartition);
    this.PulblicRecordPartition = this.homogenizeArray<
      IPublicPartition,
      PublicPartition
    >(this.PulblicRecordPartition, PublicPartition);
    this.Subscriber = this.homogenizeArray<ISubscriber, Subscriber>(
      this.Subscriber,
      Subscriber
    );
    this.Message = this.homogenizeArray<IMessage, Message>(
      this.Message,
      Message
    );
    this.Summary = new Summary(this.Summary);
    this.Sources = this.homogenizeArray<ISourceSummary, SourceSummary>(
      this.Sources,
      SourceSummary
    );
  }
}
