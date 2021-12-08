'use strict';
import { IGetCampaign } from 'lib/interfaces';
import { getCampaign } from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { campaignId } = event.queryStringParameters as { campaignId: string };
  if (!campaignId) return response(404, 'Not found');
  const payload = { campaignId };
  const validate = ajv.getSchema<IGetCampaign>('campaignsGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { campaignId } = payload;
    const campaign = await getCampaign(campaignId);
    return campaign ? response(200, campaign) : response(404, campaign);
  } catch (err) {
    return response(500, err);
  }
};
