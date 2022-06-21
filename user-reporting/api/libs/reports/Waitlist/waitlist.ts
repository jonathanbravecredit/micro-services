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
    return await parallelScanWaitlist(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items?.map(async (item: Waitlist) => {
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        const { id, firstName, lastName, phone, email, referralCode, referredByCode = "" } = item;
        const ops = new OpsReportMaker(
          ReportNames.WaitlistAnalytics,
          batchId,
          JSON.stringify(schema),
          JSON.stringify({
            id: id,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            referralCode: referralCode,
            referredByCode: referredByCode,
          }),
        );
        console.log("Report Ops: ", ops);
        try {
          await OpsReportQueries.createOpReport(ops);
          this.counter++;
          return true;
        } catch (err) {
          console.error("OpsReport Query Error: ", JSON.stringify(err));
          return false;
        }
      }),
    );
  }

  async processNext() {
    console.log("process next this.scan: ", JSON.stringify(this.scan));
    if (!this.scan) return;
    if (this.scan.lastEvaluatedKey != undefined) {
      const packet: IBatchMsg<IAttributeValue> = {
        exclusiveStartKey: this.scan.lastEvaluatedKey,
        segment: this.scan.segment,
        totalSegments: this.scan.totalSegments,
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
