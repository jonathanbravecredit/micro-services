import { ICodeRef } from '../../../../../_types/common-tu';
import { ICollectionTrade } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class CollectionTrade extends Homogenize<Partial<ICollectionTrade>> implements ICollectionTrade {
    creditType: ICodeRef;
    actualPaymentAmount: number | string | null;
    originalCreditor: string | null;
    constructor(_data: Partial<ICollectionTrade>);
    init(): void;
}
