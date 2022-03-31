import { IInquirySummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class InquirySummaryInfo extends Homogenize<Partial<IInquirySummaryInfo>> implements IInquirySummaryInfo {
    NumberInLast2Years: number | string | null;
    constructor(_data: Partial<IInquirySummaryInfo>);
}
