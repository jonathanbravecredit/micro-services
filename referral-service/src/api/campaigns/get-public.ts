'use strict';
import 'reflect-metadata';
import { getCampaign } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const campaign = await getCampaign(1, 0); //This is always the active campaign;
    return campaign ? response(200, campaign) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
