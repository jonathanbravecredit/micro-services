import { ICodeRef, IRemark, ISource } from 'libs/interfaces/common.interface';
import { IBankingRecord } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Remark } from 'libs/utils/mergereport/Common/Remark';
import { Source } from 'libs/utils/mergereport/Common/Source';

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
