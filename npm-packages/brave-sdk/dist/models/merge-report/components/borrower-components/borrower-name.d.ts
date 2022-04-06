import { ICodeRef, ISource } from '../../../../types';
import { IBorrowerName, IName } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils';
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
