import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { CreditReportQueries as db } from '@bravecredit/brave-sdk';
import { ReportComparisons } from 'libs/models/report-comparisons/report-comparisons';
import { COMPARISON_DEFAULT } from 'libs/models/report-comparisons/report-comparisons.constants';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const [current, prior] = await db.listLastTwoReports(sub);
    console.log('current', current);
    console.log('prior', prior);
    if (!current || !prior) return response(200, COMPARISON_DEFAULT);
    const instance = new ReportComparisons(prior, current);
    console.log('instance', instance);
    instance.run();
    console.log('comparison', instance.comparison);
    return response(200, instance.comparison);
  } catch (err) {
    return response(500, err);
  }
};
