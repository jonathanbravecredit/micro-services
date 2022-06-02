import { ICodeRef } from 'libs/interfaces/common.interface';
import { IFinancingStatement } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

export class FinancingStatement extends Homogenize<Partial<IFinancingStatement>> implements IFinancingStatement {
  CreditorType!: ICodeRef;
  dateMaturity: string | null = null;

  constructor(_data: Partial<IFinancingStatement>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditorType = new CodeRef(this.CreditorType);
  }
}
