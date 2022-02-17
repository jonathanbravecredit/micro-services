'use strict';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { ajv } from 'lib/schema/validation';
import { Handler } from 'aws-lambda';
import { ReferralMaker } from 'lib/models/referral.model';
import { ICreateReferral } from 'lib/interfaces';
import { createReferral } from 'lib/queries';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';

export const main: Handler = async (event: { list: string[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  try {
    await Promise.all(
      list.map(async (i) => {
        const payload = { id: i, campaign: CURRENT_CAMPAIGN };
        const validate = ajv.getSchema<ICreateReferral>('referralCreate');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        const referral = new ReferralMaker(payload.id, uuid.v4());
        return await createReferral(referral);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};
