"use strict";
import "reflect-metadata";
import { response } from "libs/utils/response";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CampaignQueries } from "@bravecredit/brave-sdk";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const campaign = await CampaignQueries.getCampaign(1, 0); //This is always the active campaign;
    return campaign ? response(200, campaign) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
