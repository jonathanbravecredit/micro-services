'use strict';
import 'reflect-metadata';
import { getReferralByCode } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  if (!params) return response(200, null);
  const { referralCode } = params;
  if (!referralCode) return response(200, null);
  try {
    const referral = await getReferralByCode(referralCode);
    return referral ? response(200, referral) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
