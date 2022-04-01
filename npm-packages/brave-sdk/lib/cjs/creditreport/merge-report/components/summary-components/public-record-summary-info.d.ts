import { IPublicRecordSummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PublicRecordSummaryInfo extends Homogenize<Partial<IPublicRecordSummaryInfo>> implements IPublicRecordSummaryInfo {
    NumberOfRecords: number | string | null;
    constructor(_data: Partial<IPublicRecordSummaryInfo>);
}
