import { SQSEvent } from "aws-lambda";
import { IBatchPayload, IBatchMsg, IAttributeValue } from "../../libs/interfaces/batch.interfaces";

export const opsBatchWorkerUtil = async (reportName: string, reportClass: any, event: SQSEvent) => {
  const report = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === reportName;
  });
  console.log(`Received ${report.length} enrollmentreport records `);

  if (report.length) {
    const reportClassInvoked = new reportClass(report);
    try {
      const results = await reportClassInvoked.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  return false;
};
