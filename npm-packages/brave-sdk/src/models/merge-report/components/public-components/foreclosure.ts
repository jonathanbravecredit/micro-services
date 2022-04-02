import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class Foreclosure extends Homogenize<Partial<Foreclosure>> {
  dateSettled: string | null = null;
  liability: number | string | null = null;

  constructor(_data: Partial<Foreclosure>) {
    super(_data);
    this.homogenize(_data);
  }
}
