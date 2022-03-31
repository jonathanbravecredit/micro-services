import { ICodeRef, IRemark, ISource } from '../../../../_types/common-tu';
import { IBankingRecord } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Remark } from '../../common/remark';
import { Source } from '../../common/source';

export class BankingRecord extends Homogenize<Partial<IBankingRecord>> implements IBankingRecord {
  BankingType!: ICodeRef;
  AccountDesignator!: ICodeRef;
  IndustryCode!: ICodeRef;
  Status!: ICodeRef;
  Remark: IRemark[] = [];
  Source!: ISource;
  dateOpened: string | null = null;
  dateClosed: string | null = null;
  bureau: string | null = null;
  dateVerified: string | null = null;
  subscriberCode: string | null = null;
  bankName: string | null = null;
  balance: number | string | null = null;
  accountNumber: string | null = null;

  constructor(_data: Partial<IBankingRecord>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }
  init(): void {
    this.BankingType = new CodeRef(this.BankingType);
    this.AccountDesignator = new CodeRef(this.AccountDesignator);
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Status = new CodeRef(this.Status);
    this.Remark = this.homogenizeArray<IRemark, Remark>(this.Remark, Remark);
    this.Source = new Source(this.Source);
  }
}
