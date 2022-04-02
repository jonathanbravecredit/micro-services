import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../common/code-ref';
import { CreditAddress } from '../common/credit-address';
import { Source } from '../common/source';

export class Subscriber extends Homogenize<Partial<Subscriber>> {
  CreditAddress!: CreditAddress;
  IndustryCode!: CodeRef;
  Source!: Source;
  subscriberCode: string | null = null;
  telephone: string | null = null;
  name: string | null = null;

  constructor(_data: Partial<Subscriber>) {
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
