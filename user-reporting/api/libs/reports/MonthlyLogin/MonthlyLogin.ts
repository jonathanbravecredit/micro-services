import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { parallelScanActionData } from 'libs/db/actions';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { ReportNames } from 'libs/data/reports';
import { OpsReportMaker } from '@bravecredit/brave-sdk/dist/models/ops-report/ops-reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';
import { Analytic } from '@bravecredit/brave-sdk/dist/models/analytic/analytic';

export class MonthlyLogins extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  private month = dayjs(new Date()).add(-1, 'month').format('YYYY-MM');
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanActionData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: Analytic) => {
        const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
        const schema = {};
        const record = item;
        if (dayjs(item.createdOn).format('YYYY-MM') === this.month && item.event === 'user_log_in') {
          const ops = new OpsReportMaker(
            ReportNames.MonthlyLogIn,
            batchId,
            JSON.stringify(schema),
            JSON.stringify(record),
          );
          await OpsReportQueries.createOpReport(ops);
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
