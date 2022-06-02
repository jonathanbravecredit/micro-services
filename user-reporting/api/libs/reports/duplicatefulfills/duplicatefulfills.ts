import { ReportBase } from 'libs/reports/ReportBase';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';
import { parallelScanCreditReports } from 'libs/queries/CreditReport.queries';

export class DuplicateFulfillsRunner extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  results: { userId: string; version: number; createdOn: string }[] = [];
  constructor() {
    super([]);
  }

  async run() {
    try {
      const segments = [];
      for (let i = 0; i < 128; i++) {
        segments.push(i);
      }
      await Promise.all(
        segments.map(async (s, i) => {
          let params = {
            exclusiveStartKey: undefined,
            segment: s,
            totalSegments: segments.length,
          } as {
            exclusiveStartKey: IAttributeValue | undefined;
            segment: number;
            totalSegments: number;
          };
          // let items: IBatchMsg<DynamoDB.DocumentClient.Key> | undefined;
          let counter: number = 0;
          do {
            this.scan = await this.processQuery(params.exclusiveStartKey, params.segment, params.totalSegments);
            await this.processScan();
            params.exclusiveStartKey = this.scan?.lastEvaluatedKey;
          } while (typeof this.scan?.lastEvaluatedKey != 'undefined');
          console.log(`segment: ${s} of total segments: ${segments.length}...processed: ${counter}`);
        }),
      );
      const results = { success: true, error: null, data: `Ops:batch queued records.` };
      return JSON.stringify(results);
    } catch (err) {
      console.log('err ===> ', err);
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
    }
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanCreditReports(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    const mapped = this.scan?.items as { userId: string; version: number; createdOn: string }[];
    this.results = [...this.results, ...mapped];
  }

  async processNext(): Promise<void> {
    return;
  }
}
