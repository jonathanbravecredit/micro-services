import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';
export declare class BorrowerBureauIdentifier extends Homogenize<Partial<BorrowerBureauIdentifier>> {
    type: string | null;
    identifier: string | null;
    partitionSet: number | string | null;
    Source: Source;
    constructor(_data: Partial<BorrowerBureauIdentifier>);
    init(): void;
}
