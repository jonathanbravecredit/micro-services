import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class PhoneNumber extends Homogenize<Partial<PhoneNumber>> {
  AreaCode: string | null = null;
  Number: string | null = null;
  Extension: string | null = null;

  constructor(_data: Partial<PhoneNumber>) {
    super(_data);
    this.homogenize(_data);
  }
}
