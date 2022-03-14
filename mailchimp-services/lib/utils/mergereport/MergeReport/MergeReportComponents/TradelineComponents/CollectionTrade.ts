import { ICodeRef } from 'lib/interfaces/common.interface';
import { ICollectionTrade } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

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
