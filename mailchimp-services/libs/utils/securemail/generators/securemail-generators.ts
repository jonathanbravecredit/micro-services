import { SecuremailTriggerEmails } from 'libs/utils/securemail/constants';
import { disputeSubmitted } from 'libs/utils/securemail/templates/d01-dispute-submitted';
import { disputeResultsReady } from 'libs/utils/securemail/templates/d02-dispute-results-ready';
import { previouslyVerifiedItems } from 'libs/utils/securemail/templates/pv-item';

export const TEMPLATE_LIBRARY: Record<string, string> = {
  [SecuremailTriggerEmails.PVItems]: previouslyVerifiedItems,
  [SecuremailTriggerEmails.DisputeSubmitted]: disputeSubmitted,
  [SecuremailTriggerEmails.DisputeResultsReady]: disputeResultsReady,
};
