import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { mapEnrollmentFields } from "libs/helpers";
import { ReportNames } from "libs/data/reports";
import { OpsReportMaker, OpsReportQueries, CreditReportQueries, UpdateAppDataInput } from "@bravecredit/brave-sdk";
import { parallelScan } from "../../db/parallelScanUtil";

export class NoReportReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScan(esk, segment, totalSegments, process.env.APPDATA);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: UpdateAppDataInput) => {
        const enrolled = item?.agencies?.transunion?.enrolled;
        const active = item?.status === "active";
        if (enrolled && active) {
          const userId = item.id;
          const report = await CreditReportQueries.getCurrentReport(userId);
          if (!report) {
            const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
            const schema = {};
            const record = mapEnrollmentFields(item);
            const ops = new OpsReportMaker(
              ReportNames.NoReportReport,
              batchId,
              JSON.stringify(schema),
              JSON.stringify(record)
            );
            await OpsReportQueries.createOpReport(ops);
            this.counter++;
            return true;
          } else {
            return false;
          }
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
        ReportNames.NoReportReport,
        process.env.OPSBATCH_SNS_ARN || ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
