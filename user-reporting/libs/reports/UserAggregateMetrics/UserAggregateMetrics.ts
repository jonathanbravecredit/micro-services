import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { ReportNames } from 'libs/data/reports';
import { createOpReport } from 'libs/queries/ops-report.queries';
import { parallelScanAppData } from 'libs/db/appdata';
import { IAppDataInput } from 'libs/interfaces/appdata.interfaces';
import { UserSummary } from 'libs/utils/UserSummary';

export class UserAggregateMetrics extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async parallelScan(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanAppData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: IAppDataInput) => {
        const user = new UserSummary(item);
        const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
        const schema = {};
        const record = user.report;
        if (user.userEnrolled) {
          const ops = new OpsReportMaker(
            ReportNames.UserAggregatedMetrics,
            batchId,
            JSON.stringify(schema),
            JSON.stringify(record),
          );
          await createOpReport(ops);
          this.counter++;
          return true;
        } else {
          return false;
        }
      }),
    );
  }

  async processNext() {
    const scan = this.scan;
    if (scan?.lastEvaluatedKey != undefined) {
      const packet: IBatchMsg<IAttributeValue> = {
        exclusiveStartKey: scan.lastEvaluatedKey,
        segment: scan.segment,
        totalSegments: scan.totalSegments,
      };
      const payload = this.pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'usermetricsreport');
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
