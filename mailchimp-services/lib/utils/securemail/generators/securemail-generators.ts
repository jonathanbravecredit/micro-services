import { SecuremailTriggerEmails } from 'lib/utils/securemail/constants';
import { disputeSubmitted } from 'lib/utils/securemail/templates/d01-dispute-submitted';
import { disputeResultsReady } from 'lib/utils/securemail/templates/d02-dispute-results-ready';
import { previouslyVerifiedItems } from 'lib/utils/securemail/templates/pv-item';

export const TEMPLATE_LIBRARY: Record<string, string> = {
  [SecuremailTriggerEmails.PVItems]: previouslyVerifiedItems,
  [SecuremailTriggerEmails.DisputeSubmitted]: disputeSubmitted,
  [SecuremailTriggerEmails.DisputeResultsReady]: disputeResultsReady,
};
