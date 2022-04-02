import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class CreditScoreFactor extends Homogenize<Partial<CreditScoreFactor>> {
  Factor!: CodeRef;
  FactorText: string[] = [];
  FactorType: 'Negative' | 'Positive' | null = null;
  bureauCode: number | null = null;

  constructor(_data: Partial<CreditScoreFactor>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Factor = new CodeRef(this.Factor);
  }
}
