"use strict";
import "reflect-metadata";
import * as uuid from "uuid";
import { ajv } from "libs/schema/validation";
import { response } from "libs/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { safeParse } from "libs/utils/safeJson";
import { CURRENT_CAMPAIGN } from "libs/data/campaign";
import { ICreateReferral } from "libs/interfaces";
import { ReferralQueries, ReferralMaker } from "@bravecredit/brave-sdk";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("event: ", JSON.stringify(event));
  const body: { id: string; referredByCode?: string } = safeParse(
    event,
    "body"
  ); // referredByCode;
  const payload: ICreateReferral = { ...body, campaign: CURRENT_CAMPAIGN };
  const validate = ajv.getSchema<ICreateReferral>("referralCreate");
  if (!validate || !validate(payload))
    throw `Malformed message=${JSON.stringify(payload)}`;
  console.log("payload ", JSON.stringify(payload));
  try {
    // determine eligibility
    // const approved = await eligible(payload);
    const referredBy = payload.referredByCode
      ? await ReferralQueries.getReferralByCode(payload.referredByCode)
      : null;
    if (referredBy && payload.referredByCode) {
      console.log("here 1: ", referredBy, payload.referredByCode);
      const referral = new ReferralMaker(
        payload.id,
        uuid.v4(),
        payload.referredByCode,
        referredBy.id
      );
      const res = await ReferralQueries.createReferral(referral);
      console.log("res 1: ", res);
    } else {
      const referral = new ReferralMaker(payload.id, uuid.v4());
      const res = await ReferralQueries.createReferral(referral);
      console.log("res 2: ", res);
    }
  } catch (err) {
    console.log("error 2: ", err);
    return response(500, err);
  }

  try {
    // await createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    console.log("error 2: ", err);
    return response(500, err);
  }
};
