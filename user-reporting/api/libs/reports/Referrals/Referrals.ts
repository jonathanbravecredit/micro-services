import { parallelScan } from "../../db/parallelScanUtil";
import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { ReportNames } from "libs/data/reports";
import { OpsReportMaker, OpsReportQueries, Referral } from "@bravecredit/brave-sdk";

export class Referrals extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScan(esk, segment, totalSegments, "Referrals");
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: Referral) => {
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        let record: Referral = item;
        console.log("referral report record: ", JSON.stringify(record));
        if (!record.enrolled) return;
        const ops = new OpsReportMaker(
          ReportNames.ReferralsAll,
          batchId,
          JSON.stringify(schema),
          JSON.stringify({
            ...record,
            referralEmail: "",
            referredById: record.referredById || "",
            referredByEmail: record.referredByEmail || "",
          })
        );
        await OpsReportQueries.createOpReport(ops);
        this.counter++;
        return true;
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
        "referralsreport",
        process.env.OPSBATCH_SNS_ARN || ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
