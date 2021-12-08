'use strict';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return response(404, `success`);
  // const payload: interfaces.IDeleteReferral = { id };
  // const validate = ajv.getSchema<interfaces.IDeleteReferral>('referralDelete');
  // if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  // try {
  //   const { id } = payload;
  //   await queries.deleteReferral(id);
  //   return response(200, `success`);
  // } catch (err) {
  //   return response(500, err);
  // }
};
