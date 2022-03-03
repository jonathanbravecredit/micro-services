import { SecuremailTriggerEmails } from 'lib/utils/securemail/constants';
import { disputeSubmitted } from 'lib/utils/securemail/templates/d01-dispute-submitted';
import { disputeResultsReady } from 'lib/utils/securemail/templates/d02-dispute-results-ready';
import { previouslyVerifiedItems } from 'lib/utils/securemail/templates/pv-item';

export class SecureMailGenerators {
  constructor() {}
  static generateEmailTemplate(template: string, content: string): string {
    return templateLibrary[template](content);
  }
}

const templateLibrary: Record<string, (content: string) => string> = {
  [SecuremailTriggerEmails.PVItems]: (content: string) => previouslyVerifiedItems.replace('####', content),
  [SecuremailTriggerEmails.DisputeSubmitted]: (content: string) => disputeSubmitted,
  [SecuremailTriggerEmails.DisputeResultsReady]: (content: string) => disputeResultsReady,
};
