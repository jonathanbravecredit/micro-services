import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';
import { TransunionReportQueries } from './transunion-report-queries';
export declare class TransunionQueries {
    static dispute: typeof TransunionDisputeQueries;
    static report: typeof TransunionReportQueries;
    static exceptions: typeof TransunionExceptionQueries;
    constructor();
}
