'use strict';
import * as interfaces from 'lib/interfaces';
import { getReferral, getAllEnrolledReferralsByCampaign } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ajv } from 'lib/schema/validation';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ===> ', event);
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign } = event.queryStringParameters as { campaign: string };
  const payload: interfaces.IGetReferralByCampaign = { id, campaign };
  const validate = ajv.getSchema<interfaces.IGetReferralByCampaign>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const referral = await getReferral(id);
    if (!referral) {
      return response(404, null);
    }
    if (!referral.referralCode) {
      return response(200, {
        earnings: 0,
        currency: 'USD',
        campaing: referral.campaign,
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
