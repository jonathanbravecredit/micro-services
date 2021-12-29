'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { getReferral, getAllEnrolledReferralsByCampaign, createReferral } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createBlankMonthlyReferral } from 'lib/utils/referrals/referral.utils';
import { campaignPaymentLogic } from 'lib/utils/campaigns/campaignPaymentLogic';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign } = event.queryStringParameters as {
    campaign: string;
  };

  const payload: interfaces.IGetReferralByCampaign = {
    id,
    campaign,
  };
  const validate = ajv.getSchema<interfaces.IGetReferralByCampaign>('referralCampaignEarningsMonthlyGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const { campaign } = payload;
    const referral = await getReferral(payload.id);
    const code = referral?.referralCode;
    if (!referral || !code || referral.referralStatus === 'suspended') {
      const blank = createBlankMonthlyReferral();
      return response(200, blank); // exists but no earnings
    }

    console.log('payload ===> ', payload);

    const allReferrals = await getAllEnrolledReferralsByCampaign(code, campaign);
    const { paymentsProcessed, paymentsPending, paymentScheduledDate } = campaignPaymentLogic[campaign](allReferrals);

    return response(200, {
      paymentsProcessed,
      paymentsPending,
      paymentScheduledDate,
    });
  } catch (err) {
    return response(500, err);
  }
};
