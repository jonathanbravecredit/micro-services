"use strict";
import * as interfaces from "lib/interfaces";
import * as queries from "lib/queries";
import { response } from "lib/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ajv } from "lib/schema/validation";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  let month: string | undefined;
  let year: string | undefined;

  if (event.queryStringParameters) {
    month = event.queryStringParameters.month;
    year = event.queryStringParameters.year;
  }

  const payload: interfaces.IGetEarningReferralMonthly = { id };
  const validate =
    ajv.getSchema<interfaces.IGetEarningReferralMonthly>("referralGet");
  if (!validate || !validate(payload))
    throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const referral = await queries.getReferral(id);
    if (!referral) {
      return response(404, null);
    }
    if (!referral.referralCode) {
      return response(200, [
        {
          earnings: 0,
          currency: "USD",
          enrollmentDate: referral.createdOn,
          month: 0,
          year: 0,
        },
      ]);
    }

    if (month && year) {
      const allEnrolledReferralsByMonth =
        await queries.listEnrolledReferralsByReferredMontly(
          referral.referralCode,
          month,
          year
        );

      return response(200, {
        earnings: 5 * allEnrolledReferralsByMonth.length, // THIS WILL RETURN A SINGLE OBJECT WITH THE AMOUNT OF EARNING FOR THE SPECIFIED YEAR AND MONTH
        currency: "USD",
        enrollmentDate: referral.createdOn,
        month: month,
        year: year,
      });
    } else {
      const allEnrolledReferralsByMonth =
        await queries.listEnrolledReferralsByReferredMontly(
          referral.referralCode
        );

      /* Not quite sure how to tackle this. We want an array of objects,
        one for each month with the earnings for that month,
        but how do we figure out how many months / years, and order it properly? */

      return response(200, {});
    }
  } catch (err) {
    return response(500, err);
  }
};
