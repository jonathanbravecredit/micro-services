import { IMaritalItem } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class MaritalItem extends Homogenize<Partial<IMaritalItem>> implements IMaritalItem {
    spouse: string | null;
    constructor(_data: Partial<IMaritalItem>);
}
