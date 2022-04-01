import { TransunionReportParsers } from './transunion-report-parsers';
import { TransunionDisputeParsers } from './transunion-dispute-parsers';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';
export class TransunionParsers {
}
TransunionParsers.report = TransunionReportParsers;
TransunionParsers.dispute = TransunionDisputeParsers;
TransunionParsers.onboarding = TransunionOnboardingParsers;
