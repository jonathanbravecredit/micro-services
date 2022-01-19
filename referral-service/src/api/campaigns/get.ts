'use strict';
import 'reflect-metadata';
import { IGetCampaign } from 'lib/interfaces';
import { getCampaign } from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { pKey, version } = event.queryStringParameters as unknown as { pKey: number; version: number };
  const payload = { pKey, version };
  const validate = ajv.getSchema<IGetCampaign>('campaignsGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const campaign = await getCampaign(1, 0);
    return campaign ? response(200, campaign) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
