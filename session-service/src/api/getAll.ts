'use strict';
import 'reflect-metadata';
import { getLatestSession } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;
  if (!params) return response(200, null);
  const { sub } = event?.requestContext?.authorizer?.claims;
  const { limit = '1', sort = 'desc' } = params;
  try {
    const session = await getLatestSession(sub, limit, sort);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
