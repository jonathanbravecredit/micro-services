import { TransunionReportQueries } from './transunion-report-queries';
import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';
export declare class TransunionQueries {
    static report: typeof TransunionReportQueries;
    static dispute: typeof TransunionDisputeQueries;
    static exceptions: typeof TransunionExceptionQueries;
    constructor();
}
