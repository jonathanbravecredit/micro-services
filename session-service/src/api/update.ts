'use strict';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IUpdateSessionData } from 'lib/interfaces';
import { safeParse } from 'lib/utils/safeJson';
import { updateSession } from 'lib/queries';
import { Session } from 'lib/models/session.model';
import { response } from 'lib/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: IUpdateSessionData = safeParse(event, 'body');
  if (payload.event === 'key_page_view') {
    try {
      const session: Partial<Session> = {
        userId: payload.userId,
        sessionId: payload.sessionId,
        sessionExpirationDate: payload.expirationDate,
      };
      const updated = await updateSession(session);

      if ((updated?.pageViews || 0) >= 3) {
        //todo add update to referral
      }

      return updated ? response(200, updated) : response(404, updated);
    } catch (err) {
      return response(500, err);
    }
  } else {
    try {
      const session: Partial<Session> = {
        userId: payload.userId,
        sessionId: payload.sessionId,
        sessionExpirationDate: payload.expirationDate,
        pageViews: 3,
      };
      const updated = await updateSession(session);

      //todo add update to referral

      return updated ? response(200, updated) : response(404, updated);
    } catch (err) {
      return response(500, err);
    }
  }
};
