import { ICodeRef, ISource } from '../../../../../_types/common-tu';
import { IBorrowerName, IName } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class BorrowerName extends Homogenize<Partial<IBorrowerName>> implements IBorrowerName {
    Name: IName;
    NameType: ICodeRef;
    Source: ISource;
    partitionSet: number | string | null;
    dateReported: string | null;
    dateUpdated: string | null;
    constructor(_data: Partial<IBorrowerName>);
    init(): void;
}
