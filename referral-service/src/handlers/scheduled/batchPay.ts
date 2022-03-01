'use strict';
import 'reflect-metadata';
import { ajv } from 'lib/schema/validation';
import { Handler } from 'aws-lambda';
import { IGetReferral } from 'lib/interfaces';
import { getReferral, updatePaidOut } from 'lib/queries';
import { Referral } from 'lib/models/referral.model';

export const main: Handler = async (event: { list: string[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  try {
    await Promise.all(
      list.map(async (id) => {
        const payload: IGetReferral = { id };
        const validate = ajv.getSchema<IGetReferral>('referralGet');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        // need a better way to set up payment logic
        // !!!! IMPORTANT
        // for now though, they will have gotten paid everything they are owed
        const referral = await getReferral(payload.id);
        if (!referral) return;
        const paidOut = sumReferralPayments(referral);
        await updatePaidOut(referral.id, paidOut);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};

const sumReferralPayments = (referral: Referral): number => {
  const { campaignActiveAddOn, campaignActiveEarned, campaignActiveBonus } = referral;
  return campaignActiveAddOn + campaignActiveEarned + campaignActiveBonus;
}