import { IInquiryPartition, IInquiry } from '../../../_types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class InquiryPartition extends Homogenize<Partial<IInquiryPartition>> implements IInquiryPartition {
    Inquiry: IInquiry;
    constructor(_data: Partial<IInquiryPartition>);
    init(): void;
}
