'use strict';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IUpdateSessionData } from 'lib/interfaces';
import { safeParse } from 'lib/utils/safeJson';
import { updateSession } from 'lib/queries';
import { Session } from 'lib/models/session.model';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, null);
  const payload: IUpdateSessionData = safeParse(event, 'body');
  if (payload.event === 'key_page_view') {
    try {
      const session: Partial<Session> = {
        userId: sub,
        sessionId: payload.sessionId,
        sessionExpirationDate: payload.expirationDate,
      };
      const updated = await updateSession(session, 1);
      return updated ? response(200, updated) : response(200, null);
    } catch (err) {
      return response(500, err);
    }
  } else if (payload.event === 'disputes_enroll') {
    try {
      const session: Partial<Session> = {
        userId: sub,
        sessionId: payload.sessionId,
        sessionExpirationDate: payload.expirationDate,
      };
      const updated = await updateSession(session, 3);
      return updated ? response(200, updated) : response(200, null);
    } catch (err) {
      console.log('err: ', JSON.stringify(err));
      return response(500, err);
    }
  } else {
    try {
      const session: Partial<Session> = {
        userId: sub,
        sessionId: payload.sessionId,
        sessionExpirationDate: payload.expirationDate,
      };
      const updated = await updateSession(session, 0);
      return updated ? response(200, updated) : response(200, null);
    } catch (err) {
      console.log('err: ', JSON.stringify(err));
      return response(500, err);
    }
  }
};
