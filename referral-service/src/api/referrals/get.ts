'use strict';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const payload: interfaces.IGetReferral = { id };
  const validate = ajv.getSchema<interfaces.IGetReferral>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { id } = payload;
    const referral = await queries.getReferral(id);
    return referral ? response(200, referral) : response(404, referral);
  } catch (err) {
    return response(500, err);
  }
};
