import { IPhoneNumber } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PhoneNumber extends Homogenize<Partial<IPhoneNumber>> implements IPhoneNumber {
    AreaCode: string | null;
    Number: string | null;
    Extension: string | null;
    constructor(_data: Partial<IPhoneNumber>);
}
