import { ICodeRef } from 'lib/interfaces/common.interface';
import { ICreditScoreFactor } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

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
