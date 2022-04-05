import { ICodeRef } from '../../../../types';
import { IWatchTrade } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class WatchTrade extends Homogenize<Partial<IWatchTrade>> implements IWatchTrade {
    ContactMethod: ICodeRef;
    CreditType: ICodeRef;
    PreviousAccountCondition: ICodeRef;
    previousAmountPastDue: number | string | null;
    amountPastDue: number | string | null;
    constructor(_data: Partial<IWatchTrade>);
    init(): void;
}
