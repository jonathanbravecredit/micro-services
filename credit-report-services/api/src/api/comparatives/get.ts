import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { CreditReportQueries as db } from '@bravecredit/brave-sdk';
import { ReportComparatives } from 'libs/models/report-comparatives/report-comparatives';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const [current, prior] = await db.listLastTwoReports(sub);
    const instance = new ReportComparatives(prior, current);
    instance.run();
    return response(200, instance.comparatives);
  } catch (err) {
    return response(500, err);
  }
};
