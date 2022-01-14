'use strict';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ISessionData } from 'lib/interfaces';
import { safeParse } from 'lib/utils/safeJson';
import { updateSession } from 'lib/queries';
import { Session } from 'lib/models/session.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: ISessionData = safeParse(event, 'body');
  try {
    const session: Partial<Session> = payload;
    const updated = await updateSession(session);
    return updated ? response(200, updated) : response(404, updated);
  } catch (err) {
    return response(500, err);
  }
};
