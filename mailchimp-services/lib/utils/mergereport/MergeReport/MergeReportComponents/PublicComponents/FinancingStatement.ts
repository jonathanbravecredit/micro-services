import { ICodeRef } from 'lib/interfaces/common.interface';
import { IFinancingStatement } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

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
