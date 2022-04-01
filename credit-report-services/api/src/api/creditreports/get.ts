import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { CreditReportQueries } from 'brave-sdk/dynamodb';
import { MergeReport } from 'brave-sdk/creditreport';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const report = await CreditReportQueries.getCurrentReport(sub);
    if (!report) return response(200, null);
    const resp = {
      ...report,
      report: new MergeReport(report.report),
    };
    return response(200, resp);
  } catch (err) {
    return response(500, err);
  }
};
