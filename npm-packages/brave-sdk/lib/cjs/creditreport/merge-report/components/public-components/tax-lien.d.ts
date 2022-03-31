import { ITaxLien } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class TaxLien extends Homogenize<Partial<ITaxLien>> implements ITaxLien {
    amount: number | string | null;
    dateReleased: string | null;
    constructor(_data: Partial<ITaxLien>);
}
