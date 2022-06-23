import { IAttributeValue, IBatchMsg } from "../../libs/interfaces/batch.interfaces";
import { SNS } from "aws-sdk";
import { PubSubUtil } from "../../libs/pubsub/pubsub";
import { ReportNames } from "../../libs/data/reports";

const sns = new SNS({ region: "us-east-2" });
const pubsub = new PubSubUtil();

export class TriggerUtility {
  constructor() {}

  async triggerReport(
    event: any,
    reportName: string | ReportNames,
    segmentsAmount: number = 0,
    stage: string | undefined
  ) {
    if (stage == "dev" && !event.override) return;
    if (!reportName) throw `No report provided:${reportName}`;
    try {
      let counter = 0;
      const segments: number[] = Array.from(Array(segmentsAmount).keys());
      await Promise.all(
        segments.map(async (s) => {
          const packet: IBatchMsg<IAttributeValue> = {
            exclusiveStartKey: undefined,
            segment: s,
            totalSegments: segments.length,
          };
          const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>("opsbatch", packet, reportName);
          await sns.publish(payload).promise();
        })
      );
      const results = { success: true, error: null, data: `Ops:batch queued ${counter} records.` };
      return JSON.stringify(results);
    } catch (err) {
      console.log("err ===> ", err);
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
    }
  }
}
