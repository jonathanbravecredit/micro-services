'use strict';
import 'reflect-metadata';
import { getReferralByCode } from 'libs/queries';
import { response } from 'libs/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  if (!params) return response(200, null);
  const { referralCode } = params;
  if (!referralCode) return response(200, null);
  try {
    const referral = await getReferralByCode(referralCode);
    if (referral?.suspended) return response(200, { valid: false });
    return referral ? response(200, { valid: true }) : response(200, { valid: false });
  } catch (err) {
    return response(500, err);
  }
};
