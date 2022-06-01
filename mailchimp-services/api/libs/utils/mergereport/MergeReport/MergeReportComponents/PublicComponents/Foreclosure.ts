import { IForeclosure } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class Foreclosure extends Homogenize<Partial<IForeclosure>> implements IForeclosure {
  dateSettled: string | null = null;
  liability: number | string | null = null;

  constructor(_data: Partial<IForeclosure>) {
    super(_data);
    this.homogenize(_data);
  }
}
