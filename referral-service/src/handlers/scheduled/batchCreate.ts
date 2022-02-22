'use strict';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { ajv } from 'lib/schema/validation';
import { Handler } from 'aws-lambda';
import { Referral, ReferralMaker } from 'lib/models/referral.model';
import { ICreateReferral } from 'lib/interfaces';
import { createReferral, getCampaign, getReferral, updateReferral } from 'lib/queries';

export const main: Handler = async (event: { list: string[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  const current = await getCampaign(1, 0);
  const campaign = current?.campaign || 'NO_CAMPAIGN';
  try {
    await Promise.all(
      list.map(async (id) => {
        const payload = { id, campaign };
        const validate = ajv.getSchema<ICreateReferral>('referralCreate');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        const referral = new ReferralMaker(payload.id, uuid.v4());
        // check if they already have a referral
        const existing = await getReferral(payload.id);
        if (existing) {
          const enabled: Referral = {
            ...existing,
            eligible: 1,
            enrolled: true,
          };
          await updateReferral(enabled);
        } else {
          await createReferral(referral);
          //update the eligibility and enrollment
          referral.enable();
          referral.setCampaign(campaign);
          await updateReferral(referral);
        }
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};
