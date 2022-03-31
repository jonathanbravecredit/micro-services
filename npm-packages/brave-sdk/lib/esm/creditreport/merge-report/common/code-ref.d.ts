import { ICodeRef } from '../../../_types/common-tu';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class CodeRef extends Homogenize<Partial<ICodeRef>> implements ICodeRef {
    abbreviation: string | null;
    description: string | null;
    symbol: number | string | null;
    rank: number | string | null;
    constructor(_data: Partial<ICodeRef>);
}
