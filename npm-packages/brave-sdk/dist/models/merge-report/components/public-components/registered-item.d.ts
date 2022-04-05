import { ICodeRef } from '../../../../types';
import { IRegisteredItem } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class RegisteredItem extends Homogenize<Partial<IRegisteredItem>> implements IRegisteredItem {
    Security: ICodeRef[];
    originalBalance: number | string | null;
    dateMatures: string | null;
    constructor(_data: Partial<IRegisteredItem>);
    init(): void;
}
