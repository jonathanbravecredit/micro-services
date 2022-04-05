import { ICodeRef } from '../../../../types';
import { ILegalItem } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class LegalItem extends Homogenize<Partial<ILegalItem>> implements ILegalItem {
    CourtLocation: ICodeRef;
    CourtType: ICodeRef;
    plaintiff: string | null;
    lawyer: string | null;
    thirdParty: string | null;
    actionAmount: number | string | null;
    balance: number | string | null;
    dateSatisfied: string | null;
    constructor(_data: Partial<ILegalItem>);
    init(): void;
}
