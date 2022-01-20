'use strict';
import 'reflect-metadata';
import { getLatestSession,  } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Session } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let { sub } = event.requestContext.authorizer.claims;
  let { limit, sort } = event.queryStringParameters
  try {
    const session: Session = await getLatestSession(sub, limit, sort);
    return session ? response(200, session) : response(200, null);
  } catch (err) {
    return response(500, err);
  }
};
