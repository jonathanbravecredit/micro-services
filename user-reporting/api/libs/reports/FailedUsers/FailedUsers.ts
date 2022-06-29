import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { mapSuspendedFields } from 'libs/helpers';
import * as enrollmentYTDSchema from 'libs/schema/schema_enrolled-user-report.json';
import { ReportNames } from 'libs/data/reports';
import { OpsReportMaker } from '@bravecredit/brave-sdk/dist/models/ops-report/ops-reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';
import { parallelScan } from '../../db/parallelScanUtil';

export class FailedUsers extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
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
    await Promise.all(
      this.scan?.items.map(async (item: any) => {
        const failed = item?.status === 'suspended';
        const createdAt = item?.createdAt;
        const inCurrentYear = dayjs(createdAt).isAfter(dayjs('2021-11-30'));
        if (failed && inCurrentYear) {
          const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
          const schema = enrollmentYTDSchema;
          const record = mapSuspendedFields(item);
          const ops = new OpsReportMaker(
            ReportNames.FailureYTD,
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
      const payload = this.pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'failurereport', "");
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
