import { ICodeRef, ISource } from '../../../../_types/common-tu';
import { IBorrowerTelephone, IPhoneNumber } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class BorrowerTelephone extends Homogenize<Partial<IBorrowerTelephone>> implements IBorrowerTelephone {
    PhoneNumber: IPhoneNumber;
    PhoneType: ICodeRef;
    Source: ISource;
    partitionSet: number | string | null;
    dateReported: string | null;
    dateUpdated: string | null;
    constructor(_data: Partial<IBorrowerTelephone>);
    init(): void;
}
