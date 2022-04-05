import { IPublicRecordSummary, IPublicRecordSummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PublicRecordSummary extends Homogenize<Partial<IPublicRecordSummary>> implements IPublicRecordSummary {
    Experian: IPublicRecordSummaryInfo;
    Equifax: IPublicRecordSummaryInfo;
    TransUnion: IPublicRecordSummaryInfo;
    Merge: IPublicRecordSummaryInfo;
    constructor(_data: Partial<IPublicRecordSummary>);
    init(): void;
}
