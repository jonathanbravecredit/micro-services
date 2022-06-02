import { IBankruptcy } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class Bankruptcy extends Homogenize<Partial<IBankruptcy>> implements IBankruptcy {
  courtNumber: string | null = null;
  division: string | null = null;
  assetAmount: number | string | null = null;
  dateResolved: string | null = null;
  exemptAmount: number | string | null = null;
  liabilityAmount: number | string | null = null;
  trustee: string | null = null;
  company: string | null = null;
  thirdParty: string | null = null;

  constructor(_data: Partial<IBankruptcy>) {
    super(_data);
    this.homogenize(_data);
  }
}
