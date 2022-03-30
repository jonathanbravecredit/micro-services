import { TransunionDisputeParsers, TransunionReportParsers } from '.';
import { TransunionMissing } from '../transunion-missing';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';
export class TransunionParsers extends TransunionMissing {
    constructor() {
        super();
    }
}
TransunionParsers.dispute = TransunionDisputeParsers;
TransunionParsers.report = TransunionReportParsers;
TransunionParsers.onboarding = TransunionOnboardingParsers;
