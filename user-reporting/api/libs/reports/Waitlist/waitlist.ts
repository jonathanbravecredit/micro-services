import { OpsReportMaker } from "@bravecredit/brave-sdk/dist/models/ops-report/ops-reports";
import { Waitlist } from "@bravecredit/brave-sdk/dist/models/waitlist/waitlist";
import { IBatchMsg, IBatchPayload } from "@bravecredit/brave-sdk/dist/types/batch";
import { OpsReportQueries } from "@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries";
import dayjs from "dayjs";
import { ReportNames } from "libs/data/reports";
import { parallelScanWaitlist } from "libs/db/waitlist";
import { IAttributeValue } from "libs/interfaces/batch.interfaces";
import { ReportBase } from "libs/reports/ReportBase";

export class WaitlistReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    console.log("esk 1: ", JSON.stringify(esk));
    console.log("segment 1: ", segment);
    console.log("totalSegments 1: ", totalSegments);
    return await parallelScanWaitlist(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items?.map(async (item: Waitlist) => {
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        const { id, firstName, lastName, phone, email, referralCode, referredByCode } = item;
        const ops = new OpsReportMaker(
          ReportNames.WaitlistAnalytics,
          batchId,
          JSON.stringify(schema),
          JSON.stringify({
            id,
            firstName,
            lastName,
            phone,
            email,
            referralCode,
            referredByCode,
          }),
        );
        await OpsReportQueries.createOpReport(ops);
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
        "opsbatch",
        packet,
        ReportNames.WaitlistAnalytics,
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
