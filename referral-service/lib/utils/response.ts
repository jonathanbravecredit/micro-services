/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { APIGatewayProxyResult } from 'aws-lambda';

export const response = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  },
  body: JSON.stringify(body, null, 2),
});

export const success = (body: any): APIGatewayProxyResult => response(200, body);
export const failure = (body: any): APIGatewayProxyResult => response(500, body);
