'use strict';
import 'reflect-metadata';
import { ajv } from 'libs/schema/validation';
import { Handler } from 'aws-lambda';
import { IGetReferral } from 'libs/interfaces';
import { getCampaign, getReferral, updateNextPaymentDate } from 'libs/queries';
import { PaymentDateCalculator } from 'libs/utils/paymentdatecalculator/paymentDateCalculator';

export const main: Handler = async (event: { list: string[] }): Promise<void> => {
  const { list } = event;
  if (!list) return;
  try {
    await Promise.all(
      list.map(async (id) => {
        const payload: IGetReferral = { id };
        const validate = ajv.getSchema<IGetReferral>('referralGet');
        if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
        const referral = await getReferral(payload.id);
        if (!referral) return;
        const current = await getCampaign(1, 0);
        if (!current) return;
        const campaignActiveReferred = referral.campaignActiveReferred + 1;
        const bonusOrThreshold =
          (campaignActiveReferred >= current.bonusThreshold && current.bonusThreshold > 0) ||
          campaignActiveReferred >= current.maxReferrals;
        const nextPaymentDate = new PaymentDateCalculator().calcPaymentDate(bonusOrThreshold, current.endDate);
        await updateNextPaymentDate(referral.id, nextPaymentDate);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};
