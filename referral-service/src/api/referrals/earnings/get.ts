'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import * as vouchers from 'voucher-code-generator';
import { createReferral, getReferral, listEnrolledReferralsByReferredBy as getAll } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ajv } from 'lib/schema/validation';
import { ReferralMaker } from 'lib/models/referral.model';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ===> ', event);
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { month, year } = event.queryStringParameters as { month: string | undefined; year: string | undefined };
  const payload: interfaces.IGetEarningReferral = { id };
  const validate = ajv.getSchema<interfaces.IGetEarningReferral>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const referral = await getReferral(id);
    if (!referral) {
      const campaign = CURRENT_CAMPAIGN;
      const referralCode = vouchers.generate({ length: 7, count: 1 })[0];
      const newReferral = new ReferralMaker(id, referralCode, campaign);
      newReferral.updateReferralEnrollment('enrolled'); // can only be enrolled when they get here
      await createReferral(newReferral);
      const now = new Date();
      return response(200, {
        earnings: 0,
        currency: 'USD',
        enrollmentDate: now.toISOString(),
      });
    }
    if (!referral.referralCode) {
      return response(200, {
        earnings: 0,
        currency: 'USD',
        enrollmentDate: referral.createdOn,
      });
    }

    const allReferrals = await getAll(referral.referralCode);
    console.log('allReferrals ==> ', JSON.stringify(allReferrals));
    const earningsAmount = 5 * allReferrals.length + 5;

    return response(200, {
      earnings: earningsAmount,
      currency: 'USD',
      enrollmentDate: referral.createdOn,
    });
  } catch (err) {
    return response(500, err);
  }
};
