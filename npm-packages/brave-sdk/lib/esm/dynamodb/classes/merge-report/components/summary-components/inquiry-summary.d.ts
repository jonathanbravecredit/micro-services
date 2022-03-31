import { IInquirySummary, IInquirySummaryInfo } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class InquirySummary extends Homogenize<Partial<IInquirySummary>> implements IInquirySummary {
    Experian: IInquirySummaryInfo;
    Equifax: IInquirySummaryInfo;
    TransUnion: IInquirySummaryInfo;
    Merge: IInquirySummaryInfo;
    constructor(_data: Partial<IInquirySummary>);
    init(): void;
}
