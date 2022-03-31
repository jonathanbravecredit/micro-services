import { IMergeReport, ITrueLinkCreditReportType } from '../../../_types/merge-report';
import { Homogenize } from '../homogenize/homogenize-data';
/**
 * Rules for merge report.
 * 1. primitives can terminate in a value or null
 * 2. no leaves can be undefined and must conform to class properties that define it
 * 3. arrays can ONLY terminate in an empty array
 * 4. complex objects CANNOT terminate in a null. Must go to leaves
 */
export declare class MergeReport extends Homogenize<Partial<IMergeReport>> implements IMergeReport {
    TrueLinkCreditReportType: ITrueLinkCreditReportType;
    constructor(_data: Partial<IMergeReport>);
    init(): void;
}
