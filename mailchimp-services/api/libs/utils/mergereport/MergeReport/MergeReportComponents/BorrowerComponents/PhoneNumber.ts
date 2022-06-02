import { IPhoneNumber } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class PhoneNumber extends Homogenize<Partial<IPhoneNumber>> implements IPhoneNumber {
  AreaCode: string | null = null;
  Number: string | null = null;
  Extension: string | null = null;

  constructor(_data: Partial<IPhoneNumber>) {
    super(_data);
    this.homogenize(_data);
  }
}
