import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class CreditAddress extends Homogenize<Partial<CreditAddress>> {
  city: string | null = null;
  country: string | null = null;
  county: string | null = null;
  direction: string | null = null;
  houseNumber: string | number | null = null;
  postDirection: string | null = null;
  stateCode: string | null = null;
  streetName: string | null = null;
  unit: string | number | null = null;
  unparsedStreet: string | null = null;
  postalCode: string | number | null = null;

  constructor(_data: Partial<CreditAddress>) {
    super(_data);
    this.homogenize(_data);
  }
}
