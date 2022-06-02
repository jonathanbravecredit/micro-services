import { ICodeRef } from 'libs/interfaces/common.interface';
import { ICollectionTrade } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

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
