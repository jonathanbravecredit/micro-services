import { ICodeRef } from '../../../../../_types/common-tu';
import { IRegisteredItem } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class RegisteredItem extends Homogenize<Partial<IRegisteredItem>> implements IRegisteredItem {
    Security: ICodeRef[];
    originalBalance: number | string | null;
    dateMatures: string | null;
    constructor(_data: Partial<IRegisteredItem>);
    init(): void;
}
