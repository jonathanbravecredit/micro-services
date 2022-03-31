import { IPhoneNumber } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';

export class PhoneNumber extends Homogenize<Partial<IPhoneNumber>> implements IPhoneNumber {
  AreaCode: string | null = null;
  Number: string | null = null;
  Extension: string | null = null;

  constructor(_data: Partial<IPhoneNumber>) {
    super(_data);
    this.homogenize(_data);
  }
}
