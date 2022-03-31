import { ICodeRef } from '../../../../../_types/common-tu';
import { ICreditScoreFactor } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class CreditScoreFactor extends Homogenize<Partial<ICreditScoreFactor>> implements ICreditScoreFactor {
  Factor!: ICodeRef;
  FactorText: string[] = [];
  FactorType: 'Negative' | 'Positive' | null = null;
  bureauCode: number | null = null;

  constructor(_data: Partial<ICreditScoreFactor>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Factor = new CodeRef(this.Factor);
  }
}
