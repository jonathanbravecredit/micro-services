'use strict';
// import * as interfaces from 'lib/interfaces';
// import * as queries from 'lib/queries';
// import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import { safeParse } from 'lib/utils/safeJson';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const payload: interfaces.ICreateAnalytic = safeParse(event, 'body'); // referredByCode;
  // const validate = ajv.getSchema<interfaces.ICreateAnalytic>('analyticCreate');
  return response(200, `success`);
};
