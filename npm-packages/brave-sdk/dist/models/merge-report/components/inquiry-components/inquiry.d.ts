import { ICodeRef, ISource } from '../../../../types';
import { IInquiry } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Inquiry extends Homogenize<Partial<IInquiry>> implements IInquiry {
    IndustryCode: ICodeRef;
    Source: ISource;
    bureau: string | null;
    inquiryType: string | null;
    subscriberNumber: string | null;
    inquiryDate: string | null;
    subscriberName: string | null;
    constructor(_data: Partial<IInquiry>);
    init(): void;
}
