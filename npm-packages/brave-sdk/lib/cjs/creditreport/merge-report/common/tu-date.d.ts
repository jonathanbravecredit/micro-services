import { IDate } from '../../../_types/common-tu';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class TUDate extends Homogenize<Partial<IDate>> implements IDate {
    month: string | number | null;
    year: string | number | null;
    day: string | number | null;
    constructor(_data: Partial<IDate>);
}
