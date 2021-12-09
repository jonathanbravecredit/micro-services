'use strict';
import 'reflect-metadata';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { ICreateCampaign } from 'lib/interfaces';
import { Campaign, CampaignMaker } from 'lib/models/campaign.model';
import { createCampaign } from 'lib/queries';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: ICreateCampaign = safeParse(event, 'body'); // referredByCode;
  const validate = ajv.getSchema<ICreateCampaign>('campaignsCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { campaignId, startDate, endDate } = payload;
    const campaign: Campaign = new CampaignMaker(campaignId, startDate, endDate);
    await createCampaign(campaign);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
