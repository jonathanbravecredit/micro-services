'use strict';
import 'reflect-metadata';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { createSession } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Session, SessionMaker } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no body');
  try {
    const sessionId = uuid.v4();
    const sessionDate = new Date().toISOString();
    const sessionExpirationDate = moment(new Date()).add(1, 'day').toISOString();
    const newSession: Session = new SessionMaker(sub, sessionId, sessionDate, sessionExpirationDate);
    await createSession(newSession);
    return response(200, newSession);
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
    return response(500, err);
  }
};
