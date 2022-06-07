import dayjs from 'dayjs';
import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { mapEnrollmentFields } from 'libs/helpers';
import * as enrollmentYTDSchema from 'libs/schema/schema_enrolled-user-report.json';
import { IEnrollUserBatchMsg } from 'libs/interfaces/enrolled-user-report.interface';
import { parallelScanAppData } from 'libs/db/appdata';
import { OpsReportMaker } from '@bravecredit/brave-sdk/dist/models/ops-report/ops-reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';

export class Enrollment extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
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
      this.scan?.items.map(async (item: any) => {
        const enrolled = item?.agencies?.transunion?.enrolled;
        const enrolledOn = item?.agencies?.transunion?.enrolledOn;
        const inCurrentYear = dayjs(enrolledOn).isAfter(dayjs('2021-11-30'));
        if (enrolled && inCurrentYear) {
          const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
          const schema = enrollmentYTDSchema;
          const record = mapEnrollmentFields(item);
          console.log('enrollment report record: ', JSON.stringify(record));
          const ops = new OpsReportMaker('enrollmentYTD', batchId, JSON.stringify(schema), JSON.stringify(record));
          console.log('ops: ', JSON.stringify(ops));
          try {
            await OpsReportQueries.createOpReport(ops);
            this.counter++;
            return true;
          } catch (err) {
            console.log('enrollment report opsreportquery error: ', JSON.stringify(err));
            return false;
          }
        } else {
          return false;
        }
      }),
    );
  }

  async processNext() {
    const scan = this.scan;
    if (scan?.lastEvaluatedKey != undefined) {
      const packet: IEnrollUserBatchMsg = {
        exclusiveStartKey: scan.lastEvaluatedKey,
        segment: scan.segment,
        totalSegments: scan.totalSegments,
      };
      console.log('processing next: ', JSON.stringify(packet));
      const payload = this.pubsub.createSNSPayload<IEnrollUserBatchMsg>('opsbatch', packet, 'enrollmentreport');
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }
}
