'use strict';
import 'reflect-metadata';
import { getAds } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Ad } from 'lib/models/ads.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const ads: Ad[] = await getAds();
    return ads ? response(200, ads) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
