'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import * as vouchers from 'voucher-code-generator';
import { getReferral, getAllEnrolledReferralsByCampaign, createReferral } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ajv } from 'lib/schema/validation';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';
import { ReferralMaker } from 'lib/models/referral.model';
import { createBlankMonthlyReferral } from 'lib/utils/referrals/referral.utils';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ===> ', event);
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign } = event.queryStringParameters as { campaign: string };
  const payload: interfaces.IGetReferralByCampaign = { id, campaign };
  const validate = ajv.getSchema<interfaces.IGetReferralByCampaign>('referralCampaignEarningsGet');
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
      const blank = createBlankMonthlyReferral();
      return response(200, {
        earnings: 0,
        currency: 'USD',
        campaign: newReferral.campaign,
        enrollmentDate: newReferral.createdOn,
      });
    }
    if (!referral.referralCode || referral.referralStatus === 'suspended') {
      return response(200, {
        earnings: 0,
        currency: 'USD',
        campaign: referral.campaign,
        enrollmentDate: referral.createdOn,
      });
    }

    const allReferrals = await getAllEnrolledReferralsByCampaign(referral.referralCode, campaign);
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
