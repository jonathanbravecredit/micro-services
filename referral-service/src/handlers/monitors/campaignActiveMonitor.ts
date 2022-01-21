import { ScheduledEvent, ScheduledHandler } from 'aws-lambda';
import { getCampaign, getLatestCampaign, updateCurrentCampaign } from 'lib/queries';
import * as moment from 'moment';

export const main: ScheduledHandler = async (event: ScheduledEvent): Promise<void> => {
  // current campaign has ended
  try {
    const campaign = await getCampaign(1, 0);
    console.log('campaign: ', campaign);
    const now = new Date();
    let msg = 'possible campaign ending';
    if (moment(now).isAfter(campaign?.endDate)) {
      // get the default campaign
      const noCampaign = await getCampaign(1, 1);

      const update = {
        ...noCampaign!,
        currentVersion: 1,
      };
      await updateCurrentCampaign(update);
      msg = 'campaign has ended';
    }
    console.log('old campaign msg: ', msg);
  } catch (err) {
    console.log('campaign monitor end campaign error: ', JSON.stringify(err));
  }

  // new campaign has started
  try {
    const current = await getCampaign(1, 0);
    const latest = (await getLatestCampaign(1))[0];
    console.log('latest: ', latest);
    const now = new Date();
    const started = moment(now).isAfter(latest?.startDate);
    const ongoing = moment(now).isBefore(latest?.endDate);
    const active = current?.version === latest.version;
    let msg = 'no new campaign';
    console.log('tests: ', started, ongoing, !active);
    if (started && ongoing && !active) {
      // set the current campaign to the started campaign
      const update = {
        ...latest!,
        currentVersion: latest.version,
      };
      await updateCurrentCampaign(update);
      msg = 'campaign has been updated';
    }
    console.log('new campaign msg: ', msg);
  } catch (err) {
    console.log('campaign monitor start campaign error: ', JSON.stringify(err));
  }
};
