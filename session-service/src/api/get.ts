'use strict';
import 'reflect-metadata';
import { getSession } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const params = event.pathParameters;
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!params || !sub) return response(200, null);
  const { sessionId } = params;
  if (!sessionId || !sub) return response(200, null);

  try {
    const session = await getSession(sub, sessionId);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
    return response(500, err);
  }
};
