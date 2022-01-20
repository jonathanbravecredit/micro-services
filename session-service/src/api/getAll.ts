'use strict';
import 'reflect-metadata';
import { getLatestSession } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const params = event.queryStringParameters;
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!params || !sub) return response(200, null);
  const { limit = '1', sort = 'desc' } = params;
  try {
    const session = await getLatestSession(sub, limit, sort);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
    return response(500, err);
  }
};
