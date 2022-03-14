import { IGarnishment } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

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
