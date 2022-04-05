import { ICreditAddress } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class CreditAddress extends Homogenize<Partial<ICreditAddress>> implements ICreditAddress {
    city: string | null;
    country: string | null;
    county: string | null;
    direction: string | null;
    houseNumber: string | number | null;
    postDirection: string | null;
    stateCode: string | null;
    streetName: string | null;
    unit: string | number | null;
    unparsedStreet: string | null;
    postalCode: string | number | null;
    constructor(_data: Partial<ICreditAddress>);
}
