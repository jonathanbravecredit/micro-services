import { IGarnishment } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class Garnishment extends Homogenize<Partial<IGarnishment>> implements IGarnishment {
  amount: number | string | null = null;
  dateSatisfied: string | null = null;
  garnishee: string | null = null;
  plaintiff: string | null = null;

  constructor(_data: Partial<IGarnishment>) {
    super(_data);
    this.homogenize(_data);
  }
}
