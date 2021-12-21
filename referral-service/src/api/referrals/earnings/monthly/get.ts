'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import * as vouchers from 'voucher-code-generator';
import { createReferral, getReferral, listEnrolledReferralsByReferredByMonthly as getAll } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ajv } from 'lib/schema/validation';
import { createBlankMonthlyReferral, groupReferralsByYearMonth } from 'lib/utils/referrals/referral.utils';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';
import { ReferralMaker } from 'lib/models/referral.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ===> ', event);
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { month, year } = event.queryStringParameters as {
    month: string | undefined;
    year: string | undefined;
  };

  const payload: interfaces.IGetEarningReferralMonthly = { id };
  const validate = ajv.getSchema<interfaces.IGetEarningReferralMonthly>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const referral = await getReferral(id);
    const code = referral?.referralCode;
    if (!referral) {
      const campaign = CURRENT_CAMPAIGN;
      const referralCode = vouchers.generate({ length: 7, count: 1 })[0];
      const newReferral = new ReferralMaker(id, referralCode, campaign);
      newReferral.updateReferralEnrollment('enrolled'); // can only be enrolled when they get here
      await createReferral(newReferral);
      const now = new Date();
      const blank = createBlankMonthlyReferral();
      return response(200, blank); // exists but no earnings
    }
    if (!code || referral.referralStatus === 'suspended') {
      const blank = createBlankMonthlyReferral();
      return response(200, blank); // exists but no earnings
    }

    const allReferrals = await getAll(code, month, year);
    console.log('allReferrals ==> ', JSON.stringify(allReferrals));
    const grouped = groupReferralsByYearMonth(allReferrals);
    return response(200, grouped);
  } catch (err) {
    return response(500, err);
  }
};
