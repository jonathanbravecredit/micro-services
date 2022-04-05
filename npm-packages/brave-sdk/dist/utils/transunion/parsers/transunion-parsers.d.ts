import { TransunionReportParsers } from './transunion-report-parsers';
import { TransunionDisputeParsers } from './transunion-dispute-parsers';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';
export declare class TransunionParsers {
    static report: typeof TransunionReportParsers;
    static dispute: typeof TransunionDisputeParsers;
    static onboarding: typeof TransunionOnboardingParsers;
}
