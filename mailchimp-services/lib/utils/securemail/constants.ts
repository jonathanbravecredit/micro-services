import { SecureMailGenerators } from 'lib/utils/securemail/generators';

export enum SecuremailTriggerEmails {
  PVItems = 'pvItems',
  DisputeSubmitted = 'd01-dispute-submitted',
  DisputeResultsReady = 'd02-dispute-results-ready',
}

export const SecureMailTriggerGenerators: Record<string, (template: string, content: string) => any> = {
  [SecuremailTriggerEmails.PVItems]: SecureMailGenerators.generateEmailTemplate,
  [SecuremailTriggerEmails.DisputeSubmitted]: SecureMailGenerators.generateEmailTemplate,
  [SecuremailTriggerEmails.DisputeResultsReady]: SecureMailGenerators.generateEmailTemplate,
};
