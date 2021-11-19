'use strict';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Referral } from 'lib/models/referral.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: interfaces.IUpdateReferral = safeParse(event, 'body');
  console.log('payload ===> ', payload);
  // const id: string = event.requestContext.authorizer?.claims?.sub;
  const validate = ajv.getSchema<interfaces.IUpdateReferral>('referralUpdate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const referral: Partial<Referral> = payload;
    const updated = await queries.updateReferral(referral);
    console.log('updated ==> ', updated);
    return updated ? response(200, updated) : response(404, updated);
  } catch (err) {
    console.log('err ===> ', err);
    return response(500, err);
  }
};
