import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class Garnishment extends Homogenize<Partial<Garnishment>> {
  amount: number | string | null = null;
  dateSatisfied: string | null = null;
  garnishee: string | null = null;
  plaintiff: string | null = null;

  constructor(_data: Partial<Garnishment>) {
    super(_data);
    this.homogenize(_data);
  }
}
