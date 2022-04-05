'use strict';
import 'reflect-metadata';
import { ajv } from 'libs/schema/validation';
import { Handler } from 'aws-lambda';
import { IGetReferral } from 'libs/interfaces';
import { getReferral, updatePaidOut } from 'libs/queries';
import { Referral } from 'libs/models/referrals/referral.model';

export const main: Handler = async (event: { list: { id: string; amount: number }[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  try {
    await Promise.all(
      list.map(async (item) => {
        const { id, amount } = item;
        const payload: IGetReferral = { id };
        const validate = ajv.getSchema<IGetReferral>('referralGet');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        // need a better way to set up payment logic
        // !!!! IMPORTANT
        // for now though, they will have gotten paid everything they are owed
        const referral = await getReferral(payload.id);
        if (!referral) return;
        // const paidOut = sumReferralPayments(referral);
        await updatePaidOut(referral.id, amount);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};

const sumReferralPayments = (referral: Referral): number => {
  const { campaignActiveAddOn, campaignActiveEarned, campaignActiveBonus } = referral;
  return campaignActiveAddOn + campaignActiveEarned + campaignActiveBonus;
};
