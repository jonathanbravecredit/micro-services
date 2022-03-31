import { IForeclosure } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Foreclosure extends Homogenize<Partial<IForeclosure>> implements IForeclosure {
    dateSettled: string | null;
    liability: number | string | null;
    constructor(_data: Partial<IForeclosure>);
}
