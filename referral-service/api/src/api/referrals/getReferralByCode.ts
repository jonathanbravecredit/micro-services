"use strict";
import "reflect-metadata";
import { response } from "libs/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ReferralQueries } from "@bravecredit/brave-sdk";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  if (!params) return response(200, null);
  const { referralCode } = params;
  if (!referralCode) return response(200, null);
  try {
    const referral = await ReferralQueries.getReferralByCode(referralCode);
    return referral ? response(200, referral) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
