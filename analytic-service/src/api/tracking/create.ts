'use strict';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Analytics, AnalyticsMaker } from 'lib/models/analytics.model';

export const main: APIGatewayProxyHandler = async (
  proxyEvent: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const payload: interfaces.ICreateAnalytic = safeParse(proxyEvent, 'body');
  const validate = ajv.getSchema<interfaces.ICreateAnalytic>('analyticCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { id, event, sub, session, source, value } = payload;
    const analytic: Analytics = new AnalyticsMaker(id, event, sub, session, source, value);
    await queries.createAnalytics(analytic);
    return response(200, 'success');
  } catch (error) {
    return response(500, error);
  }
};
