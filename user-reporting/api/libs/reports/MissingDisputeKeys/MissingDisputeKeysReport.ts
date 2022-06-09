import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { parallelScanAppData } from 'libs/db/appdata';
import { mapAcknowledgedFields } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { OpsReportMaker, OpsReportQueries, UpdateAppDataInput } from '@bravecredit/brave-sdk';

export class MissingDisputeKeysReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanAppData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: UpdateAppDataInput) => {
        const acked = item?.agencies?.transunion?.acknowledgedDisputeTerms;
        const keys = item?.agencies?.transunion?.disputeEnrollmentKey;
        if (acked && !keys) {
          const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
          const schema = {};
          const record = mapAcknowledgedFields(item);
          const ops = new OpsReportMaker(
            ReportNames.MissingDisputeKeys,
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
        ReportNames.MissingDisputeKeys,
      );
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
