import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class Bankruptcy extends Homogenize<Partial<Bankruptcy>> {
  courtNumber: string | null = null;
  division: string | null = null;
  assetAmount: number | string | null = null;
  dateResolved: string | null = null;
  exemptAmount: number | string | null = null;
  liabilityAmount: number | string | null = null;
  trustee: string | null = null;
  company: string | null = null;
  thirdParty: string | null = null;

  constructor(_data: Partial<Bankruptcy>) {
    super(_data);
    this.homogenize(_data);
  }
}
