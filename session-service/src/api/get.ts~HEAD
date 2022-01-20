'use strict';
import 'reflect-metadata';
import { getSession, getLatestSession } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Session } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let { sessionId } = event.pathParameters;
  let { sub } = event.requestContext.authorizer.claims;
  try {
    const session: Session = await getSession(sub, sessionId);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
