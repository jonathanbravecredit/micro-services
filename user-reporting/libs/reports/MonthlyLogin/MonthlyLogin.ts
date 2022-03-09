import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { parallelScanActionData } from 'libs/db/actions';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { ReportNames } from 'libs/data/reports';
import { Analytics } from 'libs/models/analytics.model';
import { createOpReport } from 'libs/queries/ops-report.queries';

export class MonthlyLogins extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  private month = dayjs(new Date()).add(-1, 'month').format('YYYY-MM');
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async query(
    esk: IAttributeValue | string | undefined,
    segment: number | null,
    totalSegments: number | null,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    if (typeof esk == 'string') throw 'esk cannot be a string';
    if (segment === null || totalSegments === null)
      throw `segment or totalSegment cannot be null; segment:${segment}, totalSegments:${totalSegments}`;
    return await parallelScanActionData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: Analytics) => {
        const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
        const schema = {};
        const record = item;
        if (dayjs(item.createdOn).format('YYYY-MM') === this.month && item.event === 'user_log_in') {
          const ops = new OpsReportMaker(
            ReportNames.MonthlyLogIn,
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
      const payload = this.pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
        'opsbatch',
        packet,
        'monthlyloginreport',
      );
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
