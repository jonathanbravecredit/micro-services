import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class FinancingStatement extends Homogenize<Partial<FinancingStatement>> {
  CreditorType!: CodeRef;
  dateMaturity: string | null = null;

  constructor(_data: Partial<FinancingStatement>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditorType = new CodeRef(this.CreditorType);
  }
}
