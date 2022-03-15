import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { createOpReport } from 'libs/queries/ops-report.queries';
import { mapAcknowledgedFields } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { IAppDataInput } from 'libs/interfaces/appdata.interfaces';
import { pScan, query } from 'libs/db/generic';
import { ParallelScanParams } from 'libs/interfaces/generic-db.interfaces';

export class DisputeErrorsReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    const params: ParallelScanParams = {
      table: 'APITransactionLog',
      index: 'action-createdOn-index',
      key: {
        '#a': ':a',
      },
      filter: '#t <> :t',
      attributes: {
        '#a': 'action',
        '#t': 'transaction',
      },
      values: {
        ':a': 'StartDispute:error',
        ':t': '{"nil":true}',
      },
    };
    return await query(esk, params);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: IAppDataInput) => {
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
