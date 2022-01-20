'use strict';
import { ISessionDB } from 'lib/interfaces';
import { createSession } from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Session, SessionMaker } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const body = event.body;
  if (!body) return response(200, 'no body');
  const payload: ISessionDB = JSON.parse(body);
  try {
    const { userId, sessionId, sessionDate, sessionExpirationDate, pageViews, clickEvents } = payload;
    const newSession: Session = new SessionMaker(
      userId,
      sessionId,
      sessionDate,
      sessionExpirationDate,
      pageViews,
      clickEvents,
    );
    await createSession(newSession);
    return response(200, 'success');
  } catch (err) {
    console.log('err: ', JSON.stringify(err));
    return response(500, err);
  }
};
