import { ISource } from '../../../../_types/common-tu';
import { IBorrowerBureauIdentifier } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class BorrowerBureauIdentifier extends Homogenize<Partial<IBorrowerBureauIdentifier>> implements IBorrowerBureauIdentifier {
    type: string | null;
    identifier: string | null;
    partitionSet: number | string | null;
    Source: ISource;
    constructor(_data: Partial<IBorrowerBureauIdentifier>);
    init(): void;
}
