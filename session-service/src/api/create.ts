'use strict';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Session, SessionMaker } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (
  proxyEvent: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const payload: interfaces.ISessionDB = safeParse(proxyEvent, 'body');
  try {
    const { userId, sessionId, sessionDate, sessionExpirationDate, pageViews } = payload;
    const newSession: Session = new SessionMaker(userId, sessionId, sessionDate, sessionExpirationDate, pageViews);
    await queries.createSession(newSession);
    return response(200, 'success');
  } catch (error) {
    return response(500, error);
  }
};
