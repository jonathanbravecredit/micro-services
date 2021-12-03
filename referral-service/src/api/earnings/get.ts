"use strict";
import * as interfaces from "lib/interfaces";
import * as queries from "lib/queries";
import { response } from "lib/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;

  try {
    const referral = await queries.getReferral(id);
    if (!referral) {
      return response(404, null);
    }
    if (!referral.referralCode) {
      return response(200, {
        earnings: "",
        enrollmentDate: referral.createdOn,
      });
    }

    const allEnrolledReferrals =
      await queries.listEnrolledReferralsByReferredBy(referral.referralCode);

    const earningsAmount = 5 * allEnrolledReferrals.length + 5;

    return response(200, {
      earnings: `$${earningsAmount}`,
      enrollmentDate: referral.createdOn,
    });
  } catch (err) {
    return response(500, err);
  }
};

// export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const id: string = event.requestContext.authorizer?.claims?.sub;
//     const payload: interfaces.IGetReferral = { id };
//     const validate = ajv.getSchema<interfaces.IGetReferral>('referralGet');
//     if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
//     try {
//       const { id } = payload;
//       const referral = await queries.getReferral(id);
//       return referral ? response(200, referral) : response(404, referral);
//     } catch (err) {
//       return response(500, err);
//     }
//   };
