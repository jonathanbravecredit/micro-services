import { TransunionReportParsers } from './transunion-report-parsers';
import { TransunionDisputeParsers } from './transunion-dispute-parsers';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';

export class TransunionParsers {
  static report = TransunionReportParsers;
  static dispute = TransunionDisputeParsers;
  static onboarding = TransunionOnboardingParsers;
}
