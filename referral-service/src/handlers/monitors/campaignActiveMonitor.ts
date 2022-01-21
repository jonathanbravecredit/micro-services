import { ScheduledEvent, ScheduledHandler } from 'aws-lambda';
import { getCampaign, getLatestCampaign, updateCurrentCampaign } from 'lib/queries';
import * as moment from 'moment';

export const main: ScheduledHandler = async (event: ScheduledEvent): Promise<void> => {
  // current campaign has ended
  try {
    const campaign = await getCampaign(1, 0);
    console.log('campaign: ', campaign);
    const now = new Date();
    if (moment(now).isAfter(campaign?.endDate)) {
      // get the default campaign
      const noCampaign = await getCampaign(1, 1);
      console.log('noCampaign: ', noCampaign);
      await updateCurrentCampaign(noCampaign!);
    }
  } catch (err) {
    console.log('campaign monitor end campaign error: ', JSON.stringify(err));
  }

  // new campaign has started
  try {
    const current = await getCampaign(1, 0);
    const latest = await getLatestCampaign(1);
    const now = new Date();
    const started = moment(now).isAfter(latest?.startDate);
    const ended = moment(now).isAfter(latest?.endDate);
    const alreadyStarted = current?.version === latest.version;
    if (started && !ended && !alreadyStarted) {
      // set the current campaign to the started campaign
      await updateCurrentCampaign(latest);
    }
  } catch (err) {
    console.log('campaign monitor start campaign error: ', JSON.stringify(err));
  }
};
