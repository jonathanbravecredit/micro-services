"use strict";
import * as interfaces from "lib/interfaces";
import * as queries from "lib/queries";
import { response } from "lib/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { ajv } from "lib/schema/validation";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;

  const payload: interfaces.IGetEarningReferral = { id };
  const validate = ajv.getSchema<interfaces.IGetEarningReferral>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;


  try {
    const referral = await queries.getReferral(id);
    if (!referral) {
      return response(404, null);
    }
    if (!referral.referralCode) {
      return response(200, {
        earnings: 0,
        currency: "USD",
        enrollmentDate: referral.createdOn,
      });
    }

    const allEnrolledReferrals =
      await queries.listEnrolledReferralsByReferredBy(referral.referralCode);

    const earningsAmount = 5 * allEnrolledReferrals.length + 5;

    return response(200, {
      earnings: earningsAmount,
      currency: "USD",
      enrollmentDate: referral.createdOn,
    });
  } catch (err) {
    return response(500, err);
  }
};
