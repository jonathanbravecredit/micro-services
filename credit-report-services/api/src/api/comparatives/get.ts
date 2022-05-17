import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { CreditReportQueries as db } from '@bravecredit/brave-sdk';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const [current, prior] = await db.listLastTwoReports(sub);

    // if (!report) return response(200, null);
    // const resp = {
    //   ...report,
    //   report: new MergeReport(report.report),
    //   metrics: new CreditReportMetrics(report.report), // will need to batch update with metrics
    // };
    return response(200, {});
  } catch (err) {
    return response(500, err);
  }
};
