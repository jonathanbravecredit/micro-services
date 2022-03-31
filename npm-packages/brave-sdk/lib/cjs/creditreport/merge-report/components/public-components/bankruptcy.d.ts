import { IBankruptcy } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Bankruptcy extends Homogenize<Partial<IBankruptcy>> implements IBankruptcy {
    courtNumber: string | null;
    division: string | null;
    assetAmount: number | string | null;
    dateResolved: string | null;
    exemptAmount: number | string | null;
    liabilityAmount: number | string | null;
    trustee: string | null;
    company: string | null;
    thirdParty: string | null;
    constructor(_data: Partial<IBankruptcy>);
}
