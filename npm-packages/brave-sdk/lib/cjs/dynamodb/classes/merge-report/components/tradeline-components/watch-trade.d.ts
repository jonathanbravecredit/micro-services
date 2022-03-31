import { ICodeRef } from '../../../../../_types/common-tu';
import { IWatchTrade } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class WatchTrade extends Homogenize<Partial<IWatchTrade>> implements IWatchTrade {
    ContactMethod: ICodeRef;
    CreditType: ICodeRef;
    PreviousAccountCondition: ICodeRef;
    previousAmountPastDue: number | string | null;
    amountPastDue: number | string | null;
    constructor(_data: Partial<IWatchTrade>);
    init(): void;
}
