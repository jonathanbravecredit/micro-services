import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { mapFailedFulfilFields } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { OpsReportMaker } from '@bravecredit/brave-sdk/dist/models/ops-report/ops-reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';
import { parallelScan } from '../../db/parallelScanUtil';

export class FailedFulfills extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScan(esk, segment, totalSegments, process.env.APPDATA);
  }

  async processScan(): Promise<void> {
    const fulfillCalledOn = new Date('2022-03-05');
    await Promise.all(
      this.scan?.items.map(async (item: any) => {
        const enrolled = item.agencies.transunion.enrolled;
        const fulfilledOn = new Date(item.agencies.transunion.fulfilledOn);
        const ranPriorTo = dayjs(fulfilledOn).isBefore(dayjs(fulfillCalledOn));
        if (enrolled && ranPriorTo) {
          const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
          const schema = {};
          const record = mapFailedFulfilFields(item);
          const ops = new OpsReportMaker(
            ReportNames.FailedFulfillAll,
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
        'failedfulfillreport', ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
