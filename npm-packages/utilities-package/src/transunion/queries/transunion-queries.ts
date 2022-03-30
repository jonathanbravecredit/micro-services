import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';
import { TransunionReportQueries } from './transunion-report-queries';

export class TransunionQueries {
  static dispute = TransunionDisputeQueries;
  static report = TransunionReportQueries;
  static exceptions = TransunionExceptionQueries;

  constructor() {}
}
