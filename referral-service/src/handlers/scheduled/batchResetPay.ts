'use strict';
import 'reflect-metadata';
import { ajv } from 'libs/schema/validation';
import { Handler } from 'aws-lambda';
import { IGetReferral } from 'libs/interfaces';
import { getReferral, updateAddOn, updatePaidOut } from 'libs/queries';

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
        await updatePaidOut(referral.id, 0);
        await updateAddOn(referral.id, 0);
      }),
    );
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
  }
};
