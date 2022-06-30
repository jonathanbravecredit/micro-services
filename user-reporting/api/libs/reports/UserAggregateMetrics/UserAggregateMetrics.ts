import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { ReportNames } from "libs/data/reports";
import { UserSummary } from "libs/utils/UserSummary";
import { OpsReportMaker, OpsReportQueries, UpdateAppDataInput } from "@bravecredit/brave-sdk";
import { parallelScan } from "../../db/parallelScanUtil";

export class UserAggregateMetrics extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
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
        const user = new UserSummary(item);
        await user.init();
        user.aggregate();
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        const record = user.report;
        if (user.userEnrolled) {
          const ops = new OpsReportMaker(
            ReportNames.UserAggregatedMetrics,
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
        "usermetricsreport",
        process.env.OPSBATCH_SNS_ARN || ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
