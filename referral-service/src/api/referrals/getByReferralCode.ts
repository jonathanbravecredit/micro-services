'use strict';
import 'reflect-metadata';
import * as queries from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { referralCode } = event.pathParameters;
  try {
    const referral = await queries.getReferralByReferralCode(referralCode);
    return referral ? response(200, referral) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
