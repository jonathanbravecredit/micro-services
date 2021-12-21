'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import * as vouchers from 'voucher-code-generator';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { getReferral, getAllEnrolledReferralsByMonth, createReferral } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createBlankMonthlyReferral, groupReferralsByYearMonth } from 'lib/utils/referrals/referral.utils';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';
import { ReferralMaker } from 'lib/models/referral.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ===> ', event);
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign, month, year } = event.queryStringParameters as {
    campaign: string;
    month: string | undefined;
    year: string | undefined;
  };

  const payload: interfaces.IGetReferralEarningsByCampaignMonthly = {
    id,
    campaign,
    month,
    year,
  };
  const validate = ajv.getSchema<interfaces.IGetReferralEarningsByCampaignMonthly>(
    'referralCampaignEarningsMonthlyGet',
  );
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const { campaign, month, year } = payload;
    const referral = await getReferral(payload.id);
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

    console.log('payload ===> ', payload);
    const allReferrals = await getAllEnrolledReferralsByMonth(code, campaign, month, year);
    console.log('allReferrals ==> ', JSON.stringify(allReferrals));
    const grouped = groupReferralsByYearMonth(allReferrals);
    return response(200, grouped);
  } catch (err) {
    return response(500, err);
  }
};
