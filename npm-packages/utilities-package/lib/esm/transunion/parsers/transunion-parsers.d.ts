import { TransunionDisputeParsers, TransunionReportParsers } from '.';
import { TransunionMissing } from '../transunion-missing';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';
export declare class TransunionParsers extends TransunionMissing {
    static dispute: typeof TransunionDisputeParsers;
    static report: typeof TransunionReportParsers;
    static onboarding: typeof TransunionOnboardingParsers;
    constructor();
}
