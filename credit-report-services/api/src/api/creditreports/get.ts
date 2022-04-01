import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';

// import { getReport } from 'libs/queries/CreditReport.queries';
// import { MergeReport } from 'libs/models/MergeReport/MergeReport';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const report = await CreditReportQueries; //getReport(sub, 0);
    const resp = {
      ...report,
      report: new MergeReport(report.report),
    };
    return response(200, resp);
  } catch (err) {
    return response(500, err);
  }
};
