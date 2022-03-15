import { IAttributeValue, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { SNS, SES } from 'aws-sdk';
import { PubSubUtil } from 'libs/pubsub/pubsub';

export abstract class ReportBase<B> {
  protected ses = new SES({ region: 'us-east-1' });
  protected sns = new SNS({ region: 'us-east-2' });
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
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          try {
            this.scan = await this.query(esk, segment, totalSegments);
            await this.processScan();
            this.processNext();
          } catch (err) {
            throw err;
          }
        }),
      );
      return this.onSuccess();
    } catch (err) {
      return this.onError(err);
    }
  }

  async query(
    esk: IAttributeValue | string | undefined,
    segment: number | null,
    totalSegments: number | null,
  ): Promise<B> {
    if (typeof esk == 'string') throw 'esk cannot be a string';
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
}
