'use strict';
import { IGetReferralByCampaign } from 'lib/interfaces';
import { getReferral, getAllReferralsByCampaign } from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign } = event.queryStringParameters as { campaign: string };
  const payload: IGetReferralByCampaign = { id, campaign };
  const validate = ajv.getSchema<IGetReferralByCampaign>('referralByCampaignGetAll');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { id } = payload;
    const referral = await getReferral(id);
    if (!referral) return response(404, 'Referral not found');
    const { referralCode } = referral;
    if (!referralCode) return response(404, 'Referral code not found');
    const allReferrals = await getAllReferralsByCampaign(referralCode, campaign);
    return response(200, allReferrals);
  } catch (err) {
    return response(500, err);
  }
};
