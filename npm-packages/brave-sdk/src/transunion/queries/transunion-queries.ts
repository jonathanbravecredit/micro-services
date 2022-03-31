import { TransunionReportQueries } from './transunion-report-queries';
import { TransunionDisputeQueries } from './transunion-dispute-queries';
import { TransunionExceptionQueries } from './transunion-exception-queries';

export class TransunionQueries {
  static report = TransunionReportQueries;
  static dispute = TransunionDisputeQueries;
  static exceptions = TransunionExceptionQueries;

  constructor() {}
}
