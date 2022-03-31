import { ICodeRef } from '../../../../../_types/common-tu';
import { IFinancingStatement } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

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
