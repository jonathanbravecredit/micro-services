'use strict';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { ajv } from 'lib/schema/validation';
import { Handler } from 'aws-lambda';
import { ReferralMaker } from 'lib/models/referral.model';
import { ICreateReferral } from 'lib/interfaces';
import { createReferral, getCampaign, updateReferral } from 'lib/queries';

export const main: Handler = async (event: { list: string[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  const current = await getCampaign(1, 0);
  try {
    await Promise.all(
      list.map(async (i) => {
        const payload = { id: i, campaign: current?.campaign || 'NO_CAMPAIGN' };
        const validate = ajv.getSchema<ICreateReferral>('referralCreate');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        const referral = new ReferralMaker(payload.id, uuid.v4());
        await createReferral(referral);
        //update the eligibility and enrollment
        referral.makeEligible();
        await updateReferral(referral);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};
