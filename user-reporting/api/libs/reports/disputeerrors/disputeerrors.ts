import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { mapTransactionFields } from "libs/helpers";
import { ReportNames } from "libs/data/reports";
import { query } from "libs/db/generic";
import { OpsReportMaker, OpsReportQueries, UpdateAppDataInput } from "@bravecredit/brave-sdk";

export class DisputeErrorsReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    const params = {
      ...this.createQueryInput(),
      ExclusiveStartKey: esk,
    };
    return await query(params);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: UpdateAppDataInput) => {
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        const record = mapTransactionFields(item);
        const ops = new OpsReportMaker(
          ReportNames.DisputeErrors,
          batchId,
          JSON.stringify(schema),
          JSON.stringify(record)
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
        ReportNames.DisputeErrors,
        process.env.OPSBATCH_SNS_ARN || ""
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }

  createQueryInput() {
    return {
      TableName: "APITransactionLog",
      ScanIndexForward: false,
      IndexName: "action-createdOn-index",
      KeyConditionExpression: "#a = :a",
      FilterExpression: "#t <> :t",
      ExpressionAttributeValues: {
        ":a": "StartDispute:error",
        ":t": '{"nil":true}',
      },
      ExpressionAttributeNames: {
        "#a": "action",
        "#t": "transaction",
      },
    };
  }
}
