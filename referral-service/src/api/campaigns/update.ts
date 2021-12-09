'use strict';
import 'reflect-metadata';
import { IUpdateCampaign } from 'lib/interfaces';
import { updateCampaign } from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Campaign } from 'lib/models/campaign.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: IUpdateCampaign = safeParse(event, 'body');
  const validate = ajv.getSchema<IUpdateCampaign>('campaignsUpdate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const campaign: Partial<Campaign> = payload;
    const updated = await updateCampaign(campaign);
    return updated ? response(200, updated) : response(404, updated);
  } catch (err) {
    return response(500, err);
  }
};
