import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';
import { TransunionReportQueries } from './transunion-report-queries';
export class TransunionQueries {
    constructor() { }
}
TransunionQueries.dispute = TransunionDisputeQueries;
TransunionQueries.report = TransunionReportQueries;
TransunionQueries.exceptions = TransunionExceptionQueries;
