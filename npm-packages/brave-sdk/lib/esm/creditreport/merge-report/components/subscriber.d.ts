import { ICodeRef, ISource } from '../../../_types/common-tu';
import { ISubscriber, ICreditAddress } from '../../../_types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Subscriber extends Homogenize<Partial<ISubscriber>> implements ISubscriber {
    CreditAddress: ICreditAddress;
    IndustryCode: ICodeRef;
    Source: ISource;
    subscriberCode: string | null;
    telephone: string | null;
    name: string | null;
    constructor(_data: Partial<ISubscriber>);
    init(): void;
}
