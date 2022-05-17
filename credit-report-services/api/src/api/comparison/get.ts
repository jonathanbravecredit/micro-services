import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { CreditReportQueries as db } from '@bravecredit/brave-sdk';
import { ReportComparisons } from 'libs/models/report-comparisons/report-comparisons';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const [current, prior] = await db.listLastTwoReports(sub);
    console.log('current', current);
    console.log('prior', prior);
    const instance = new ReportComparisons(prior, current);
    console.log('instance', instance);
    instance.run();
    return response(200, 'test response');
  } catch (err) {
    return response(500, err);
  }
};
