import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditAddress, ISubscriber } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Source } from 'libs/utils/mergereport/Common/Source';
import { CreditAddress } from 'libs/utils/mergereport/Common/CreditAddress';

export class Subscriber extends Homogenize<Partial<ISubscriber>> implements ISubscriber {
  CreditAddress!: ICreditAddress;
  IndustryCode!: ICodeRef;
  Source!: ISource;
  subscriberCode: string | null = null;
  telephone: string | null = null;
  name: string | null = null;

  constructor(_data: Partial<ISubscriber>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditAddress = new CreditAddress(this.CreditAddress);
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Source = new Source(this.Source);
  }
}
