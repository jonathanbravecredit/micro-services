import { IMaritalItem } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class MaritalItem extends Homogenize<Partial<IMaritalItem>> implements IMaritalItem {
    spouse: string | null;
    constructor(_data: Partial<IMaritalItem>);
}
