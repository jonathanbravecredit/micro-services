import { IName } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class TUName extends Homogenize<Partial<IName>> implements IName {
    prefix: string | null;
    first: string | null;
    middle: string | null;
    last: string | null;
    suffix: string | null;
    constructor(_data: Partial<IName>);
}
