'use strict';
import 'reflect-metadata';
import { getSession } from 'lib/queries';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  if (!params) return response(200, null);
  const { sessionId } = params;
  const { sub } = event?.requestContext?.authorizer?.claims;
  if (!sessionId || !sub) return response(200, null);

  try {
    const session = await getSession(sub, sessionId);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
