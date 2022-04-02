import { IForeclosure } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class Foreclosure extends Homogenize<Partial<IForeclosure>> implements IForeclosure {
  dateSettled: string | null = null;
  liability: number | string | null = null;

  constructor(_data: Partial<IForeclosure>) {
    super(_data);
    this.homogenize(_data);
  }
}
