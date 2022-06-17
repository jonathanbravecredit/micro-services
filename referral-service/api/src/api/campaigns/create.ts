"use strict";
import "reflect-metadata";
import {
  Campaign,
  CampaignMaker,
  CampaignQueries,
} from "@bravecredit/brave-sdk";
import { ajv } from "libs/schema/validation";
import { response } from "libs/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { safeParse } from "libs/utils/safeJson";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const payload: Campaign = safeParse(event, "body"); // referredByCode;
  const validate = ajv.getSchema<Campaign>("campaignsCreate");
  if (!validate || !validate(payload))
    throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const {
      version,
      campaign,
      denomination,
      maxReferrals,
      bonusThreshold,
      addOnFlagOne,
      addOnFlagTwo,
      addOnFlagThree,
      startDate,
      endDate,
    } = payload;
    const made = new CampaignMaker(
      version,
      campaign,
      denomination,
      maxReferrals,
      bonusThreshold,
      addOnFlagOne,
      addOnFlagTwo,
      addOnFlagThree,
      startDate,
      endDate
    );
    await CampaignQueries.createCampaign(made);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
