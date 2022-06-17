"use strict";
import "reflect-metadata";
import { ajv } from "libs/schema/validation";
import { response } from "libs/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { IGetReferral } from "libs/interfaces";
import { ReferralQueries } from "@bravecredit/brave-sdk";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const payload: IGetReferral = { id };
  const validate = ajv.getSchema<IGetReferral>("referralGet");
  if (!validate || !validate(payload))
    throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { id } = payload;
    const referral = await ReferralQueries.getReferral(id);
    return referral ? response(200, referral) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
