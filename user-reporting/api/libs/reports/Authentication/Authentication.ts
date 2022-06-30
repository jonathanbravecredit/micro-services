import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { ReportNames } from "libs/data/reports";
import { DynamoDB } from "aws-sdk";
import { APITransactionLog, OpsReportMaker, OpsReportQueries } from "@bravecredit/brave-sdk";
import { parallelScan } from "../../db/parallelScanUtil";

export class Authentication extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScan(esk, segment, totalSegments, "APITransactionLog");
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: any, i: number) => {
        const record = DynamoDB.Converter.unmarshall(item) as unknown as APITransactionLog;
        const isAuth = record.action === "Enroll:type";
        if (isAuth) {
          const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
          const schema = {};
          const ops = new OpsReportMaker(
            ReportNames.AuthenticationAll,
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
        "authenticationcalls",
        process.env.OPSBATCH_SNS_ARN || ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
