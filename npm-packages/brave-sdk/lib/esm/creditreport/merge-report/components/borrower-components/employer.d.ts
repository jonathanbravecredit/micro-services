import { ISource } from '../../../../_types/common-tu';
import { IEmployer, ICreditAddress } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Employer extends Homogenize<Partial<IEmployer>> implements IEmployer {
    CreditAddress: ICreditAddress;
    Source: ISource;
    name: string;
    partitionSet: number | string | null;
    dateReported: string | null;
    dateUpdated: string | null;
    constructor(_data: Partial<IEmployer>);
    init(): void;
}
