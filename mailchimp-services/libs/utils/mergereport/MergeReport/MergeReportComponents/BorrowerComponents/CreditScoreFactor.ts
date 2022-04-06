import { ICodeRef } from 'libs/interfaces/common.interface';
import { ICreditScoreFactor } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

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
