import { IName } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class Name extends Homogenize<Partial<IName>> implements IName {
    prefix: string | null;
    first: string | null;
    middle: string | null;
    last: string | null;
    suffix: string | null;
    constructor(_data: Partial<IName>);
}
