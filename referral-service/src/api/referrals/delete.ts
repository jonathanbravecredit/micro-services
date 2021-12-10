'use strict';
import 'reflect-metadata';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const payload: interfaces.IDeleteReferral = { id };
  const validate = ajv.getSchema<interfaces.IDeleteReferral>('referralDelete');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const { id } = payload;
    await queries.deleteReferral(id);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
