import * as dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { createOpReport } from 'libs/queries/ops-report.queries';
import { parallelScanAppData } from 'libs/db/appdata';
import { mapAcknowledgedFields } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { IAppDataInput } from 'libs/interfaces/appdata.interfaces';

export class MissingDisputeKeysReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
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
    return await parallelScanAppData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: IAppDataInput) => {
        const acked = item?.agencies?.transunion?.acknowledgedDisputeTerms;
        const keys = item?.agencies?.transunion?.disputeEnrollmentKey;
        if (acked && !keys) {
          const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
          const schema = {};
          const record = mapAcknowledgedFields(item);
          const ops = new OpsReportMaker(
            ReportNames.MissingDisputeKeys,
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
        ReportNames.MissingDisputeKeys,
      );
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}