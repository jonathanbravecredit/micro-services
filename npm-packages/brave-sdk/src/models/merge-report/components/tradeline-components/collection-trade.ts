import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class CollectionTrade extends Homogenize<Partial<CollectionTrade>> {
  creditType!: CodeRef; // TODO double check the case in XSD
  actualPaymentAmount: number | string | null = null;
  originalCreditor: string | null = null;

  constructor(_data: Partial<CollectionTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.creditType = new CodeRef(this.creditType);
  }
}
