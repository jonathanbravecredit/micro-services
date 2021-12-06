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
import { Referral } from "lib/models/referral.model";

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

      const referralMonthlyArray: {
        yearMonth: number;
        referrals: number;
        earnings: number;
        currency: "USD";
      }[] = [];

      allEnrolledReferralsByMonth.forEach((referral) => {
        const yearMonth = +`${referral.createdOn?.slice(0, 4)}${referral.createdOn?.slice(5, 7)}`;
        let found = false;

        referralMonthlyArray.forEach((referralObj) => {
          if (referralObj.yearMonth === yearMonth) {
            if (found) return;

            referralObj.referrals += 1;
            referralObj.earnings += 5;
            found = true;
            return;
          }
        });

        if (!found && yearMonth) {
          referralMonthlyArray.push({
            yearMonth,
            referrals: 1,
            earnings: 5,
            currency: "USD",
          });
        }
      });

      return response(200, referralMonthlyArray);
    }
  } catch (err) {
    return response(500, err);
  }
};
