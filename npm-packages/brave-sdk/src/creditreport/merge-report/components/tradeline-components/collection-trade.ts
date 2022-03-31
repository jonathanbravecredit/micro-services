import { ICodeRef } from '../../../../_types/common-tu';
import { ICollectionTrade } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class CollectionTrade extends Homogenize<Partial<ICollectionTrade>> implements ICollectionTrade {
  creditType!: ICodeRef; // TODO double check the case in XSD
  actualPaymentAmount: number | string | null = null;
  originalCreditor: string | null = null;

  constructor(_data: Partial<ICollectionTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.creditType = new CodeRef(this.creditType);
  }
}
