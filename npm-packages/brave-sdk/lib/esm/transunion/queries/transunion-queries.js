import { TransunionReportQueries } from './transunion-report-queries';
import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';
export class TransunionQueries {
    constructor() { }
}
TransunionQueries.report = TransunionReportQueries;
TransunionQueries.dispute = TransunionDisputeQueries;
TransunionQueries.exceptions = TransunionExceptionQueries;
