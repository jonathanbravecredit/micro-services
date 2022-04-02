import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { MergeReport, CreditReportQueries as db } from '@bravecredit/brave-sdk';
import { CreditReportMetrics } from 'libs/models/credit-report-metrics';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const report = await db.getCurrentReport(sub);
    if (!report) return response(200, null);
    const resp = {
      ...report,
      report: new MergeReport(report.report),
      metrics: new CreditReportMetrics(report.report), // will need to batch update with metrics
    };
    return response(200, resp);
  } catch (err) {
    return response(500, err);
  }
};
