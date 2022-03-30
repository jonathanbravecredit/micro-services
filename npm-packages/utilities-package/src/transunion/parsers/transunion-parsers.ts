import { TransunionDisputeParsers, TransunionReportParsers } from '.';
import { TransunionMissing } from '../transunion-missing';
import { TransunionOnboardingParsers } from './transunion-onboarding-parsers';

export class TransunionParsers extends TransunionMissing {
  static dispute = TransunionDisputeParsers;
  static report = TransunionReportParsers;
  static onboarding = TransunionOnboardingParsers;

  constructor() {
    super();
  }
}
