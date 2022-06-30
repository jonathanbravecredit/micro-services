import { IAttributeValue, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { SNS, SES } from "aws-sdk";
import { PubSubUtil } from "@bravecredit/brave-sdk";

export abstract class ReportBase<B> {
  protected ses = new SES({ region: "us-east-1" });
  protected sns = new SNS({ region: "us-east-2" });
  protected pubsub = new PubSubUtil();
  protected stage = process.env.STAGE;
  protected scan: B | undefined;
  protected counter: number = 0;

  abstract processQuery(
    arg0: IAttributeValue | string | undefined,
    arg1: number | null,
    arg2: number | null,
  ): Promise<B>;

  abstract processScan(): Promise<void>;

  abstract processNext(): void;

  constructor(private records: IBatchPayload<IBatchMsg<IAttributeValue | string>>[]) {}

  async run() {
    try {
      await Promise.all(
        this.records.map(async (rec) => {
          const message = rec.message;
          console.log("message: ", JSON.stringify(message));
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          try {
            this.scan = await this.query(esk, segment, totalSegments);
            await this.processScan();
            await this.processNext();
          } catch (err) {
            throw err;
          }
        }),
      );
      return this.onSuccess();
    } catch (err) {
      console.log(`ReportBase Error: ${JSON.stringify(this.records)}`);
      this.handleCommonErrors(err as { code: string; message: string });
      return this.onError(err);
    }
  }

  async query(
    esk: IAttributeValue | string | undefined,
    segment: number | null,
    totalSegments: number | null,
  ): Promise<B> {
    if (typeof esk == "string") throw "esk cannot be a string";
    if (segment === null || totalSegments === null)
      throw `segment or totalSegment cannot be null; segment:${segment}, totalSegments:${totalSegments}`;
    return await this.processQuery(esk, segment, totalSegments);
  }

  onSuccess(): string {
    const results = {
      success: true,
      error: null,
      data: `Ops batch worker successfully processed ${this.counter} records`,
    };
    return JSON.stringify(results);
  }

  onError(err: any): string {
    const results = {
      success: false,
      error: `Ops batch worker failed with error: ${JSON.stringify(err)}`,
      data: null,
    };
    return JSON.stringify(results);
  }

  handleCommonErrors(err: { code: string; message: string }) {
    switch (err.code) {
      case "InternalServerError":
        console.error(
          `Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case "ProvisionedThroughputExceededException":
        console.error(
          `Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` +
            `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`,
        );
        return;
      case "ResourceNotFoundException":
        console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
        return;
      case "ServiceUnavailable":
        console.error(
          `Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case "ThrottlingException":
        console.error(
          `Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case "UnrecognizedClientException":
        console.error(
          `The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` +
            `Error: ${err.message}`,
        );
        return;
      case "ValidationException":
        console.error(
          `The input fails to satisfy the constraints specified by DynamoDB, ` +
            `fix input before retrying. Error: ${err.message}`,
        );
        return;
      case "RequestLimitExceeded":
        console.error(
          `Throughput exceeds the current throughput limit for your account, ` +
            `increase account level throughput before retrying. Error: ${err.message}`,
        );
        return;
      default:
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
        return;
    }
  }
}
