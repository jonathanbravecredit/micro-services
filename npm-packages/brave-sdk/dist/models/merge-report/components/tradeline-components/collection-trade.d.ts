import { ICodeRef } from '../../../../types';
import { ICollectionTrade } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class CollectionTrade extends Homogenize<Partial<ICollectionTrade>> implements ICollectionTrade {
    creditType: ICodeRef;
    actualPaymentAmount: number | string | null;
    originalCreditor: string | null;
    constructor(_data: Partial<ICollectionTrade>);
    init(): void;
}
