import { ICodeRef, ISource } from '../../../../_types/common-tu';
import { IBorrowerAddress, ICreditAddress } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class BorrowerAddress extends Homogenize<Partial<IBorrowerAddress>> implements IBorrowerAddress {
    CreditAddress: ICreditAddress;
    Dwelling: ICodeRef;
    Origin: ICodeRef;
    Ownership: ICodeRef;
    Source: ISource;
    dateReported: string | null;
    addressOrder: number | null;
    partitionSet: number | null;
    constructor(_data: Partial<IBorrowerAddress>);
    init(): void;
}
