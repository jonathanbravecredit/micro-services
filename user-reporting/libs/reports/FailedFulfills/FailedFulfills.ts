import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import {
  IAttributeValue,
  IBatchMsg,
  IBatchPayload,
} from "libs/interfaces/batch.interfaces";
import { OpsReportMaker } from "libs/models/ops-reports";
import { createOpReport } from "libs/queries/ops-report.queries";
import { parallelScanAppData } from "../../../../mailchimp-services/libs/queries/appdata.queries";
import { mapFailedFulfilFields } from "../../helpers";
import { ReportNames } from "../../data/reports";

export class FailedFulfills extends ReportBase<
  IBatchMsg<IAttributeValue> | undefined
> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanAppData(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    const fulfillCalledOn = new Date("2022-03-05");
    await Promise.all(
      this.scan?.items.map(async (item: any) => {
        const enrolled = item.agencies.transunion.enrolled;
        const fulfilledOn = new Date(item.agencies.transunion.fulfilledOn);
        const ranPriorTo = dayjs(fulfilledOn).isBefore(dayjs(fulfillCalledOn));
        if (enrolled && ranPriorTo) {
          const batchId = dayjs(new Date())
            .add(-5, "hours")
            .format("YYYY-MM-DD");
          const schema = {};
          const record = mapFailedFulfilFields(item);
          const ops = new OpsReportMaker(
            ReportNames.FailedFulfillAll,
            batchId,
            JSON.stringify(schema),
            JSON.stringify(record)
          );
          await createOpReport(ops);
          this.counter++;
          return true;
        } else {
          return false;
        }
      })
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
        "opsbatch",
        packet,
        "failedfulfillreport"
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
