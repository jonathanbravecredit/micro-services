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
import { ReportNames } from "../../data/reports";

export class Actions extends ReportBase<
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
    await Promise.all(
      this.scan?.items.map(async (item: any) => {
        const createdOn = item?.createdOn;
        const inCurrentYear = dayjs(createdOn).isAfter(dayjs("2021-11-30"));
        if (inCurrentYear) {
          const batchId = dayjs(new Date())
            .add(-5, "hours")
            .format("YYYY-MM-DD");
          const schema = {};
          const record = item;
          const ops = new OpsReportMaker(
            ReportNames.ActionsYTD,
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
        "actionsreport"
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
