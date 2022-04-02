import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { IBatchPayload, ICreditReportPayload } from 'libs/interfaces/batch.interface';
import { CreditReportMaker, MergeReport, CreditReportMetrics, CreditReportQueries as db } from '@bravecredit/brave-sdk';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const reportRequests = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<ICreditReportPayload>;
  });
  console.log('report requests: ', JSON.stringify(reportRequests));
  if (reportRequests.length) {
    try {
      await Promise.all(
        reportRequests.map(async (rec) => {
          const message = rec.message;
          const { userId, bureau, report } = message;
          const merge = new MergeReport(report);
          const metrics = new CreditReportMetrics(merge).calculateMetrics();
          const added = new CreditReportMaker(userId, bureau, merge);
          const current = new CreditReportMaker(userId, bureau, merge, 0); // version 0 is always current
          current.setCurrentVersion(added.version);
          console.log('added: ', JSON.stringify(added));
          console.log('current: ', current);
          try {
            const create = await db.createReport({ ...added, metrics });
            console.log('create', create);
            const update = await db.updateReport({ ...current, metrics });
            console.log('update', update);
          } catch (err) {
            console.log('err: ', err);
          }
        }),
      );
    } catch (err) {
      console.log('err: ', err);
    }
  }
};
