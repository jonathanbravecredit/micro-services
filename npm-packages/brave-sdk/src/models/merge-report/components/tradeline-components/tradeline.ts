import { ICodeRef, IRemark, ISource } from '../../../../types';
import { ITradeline, IWatchTrade, IGrantedTrade, ICollectionTrade } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Remark } from '../../common/remark';
import { Source } from '../../common/source';
import { CollectionTrade } from './collection-trade';
import { GrantedTrade } from './granted-trade';
import { WatchTrade } from './watch-trade';

export class Tradeline extends Homogenize<Partial<ITradeline>> implements ITradeline {
  AccountCondition!: ICodeRef;
  AccountDesignator!: ICodeRef;
  DisputeFlag!: ICodeRef;
  IndustryCode!: ICodeRef;
  OpenClosed!: ICodeRef;
  PayStatus!: ICodeRef;
  VerificationIndicator!: ICodeRef;
  Remark!: IRemark[];
  WatchTrade!: IWatchTrade;
  GrantedTrade!: IGrantedTrade;
  CollectionTrade!: ICollectionTrade;
  Source!: ISource;
  subscriberCode: string | null = null;
  highBalance: number | string | null = null;
  dateVerified: string | null = null;
  handle: string | null = null;
  bureau: string | null = null;
  position: number | string | null = null;
  dateReported: string | null = null;
  currentBalance: number | string | null = null;
  creditorName: string | null = null;
  accountNumber: string | number | null = null;
  dateOpened: string | null = null;
  dateClosed: string | null = null;
  dateAccountStatus: string | null = null;

  constructor(_data: Partial<ITradeline>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.AccountCondition = new CodeRef(this.AccountCondition);
    this.AccountDesignator = new CodeRef(this.AccountDesignator);
    this.DisputeFlag = new CodeRef(this.DisputeFlag);
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.OpenClosed = new CodeRef(this.OpenClosed);
    this.PayStatus = new CodeRef(this.PayStatus);
    this.VerificationIndicator = new CodeRef(this.VerificationIndicator);
    this.Remark = this.homogenizeArray<IRemark, Remark>(this.Remark, Remark);
    this.WatchTrade = new WatchTrade(this.WatchTrade);
    this.GrantedTrade = new GrantedTrade(this.GrantedTrade);
    this.CollectionTrade = new CollectionTrade(this.CollectionTrade);
    this.Source = new Source(this.Source);
  }
}
