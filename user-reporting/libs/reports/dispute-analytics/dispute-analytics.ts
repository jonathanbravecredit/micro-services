import {
  IDisclosureCoverInfo,
  IDisputeCreditBureau,
  ILineItem,
  IProductArray,
} from '@bravecredit/brave-sdk/dist/types/credit-bureau';
import dayjs from 'dayjs';
import * as _ from 'lodash';
import { ReportNames } from 'libs/data/reports';
import { parallelScanDisputes } from 'libs/db/disputes';
import { IBatchMsg, IAttributeValue, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { CreditBureauReportResult } from 'libs/models/credit-bureau.model';
import { Dispute } from 'libs/models/dispute.model';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { createOpReport } from 'libs/queries/ops-report.queries';
import { ReportBase } from 'libs/reports/ReportBase';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { DisputeItem, DisputeReason } from 'libs/interfaces/dispute-items';
import { getCreditBureauReportResult } from 'libs/queries/credit-bureau-report-results.queries';

export class DisputeAnalyticsReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
    _.bindAll(this, 'parseDisputeResult');
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number,
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanDisputes(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: Dispute) => {
        const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
        const schema = {};
        const record = item;
        const { id: userId, disputeCreditBureau: cbID } = item;
        if (!userId) return;
        const reasons = this.parseDispute(item);
        const cbData = await this.queryCBReport(cbID, userId);
        const results = cbData ? this.parseCBFinding(cbData) : '';
        const enriched = {
          ...record,
          reasons,
          results,
        };
        const ops = new OpsReportMaker(
          ReportNames.DisputeAnalytics,
          batchId,
          JSON.stringify(schema),
          JSON.stringify(enriched),
        );
        await createOpReport(ops);
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
        'opsbatch',
        packet,
        ReportNames.DisputeAnalytics,
      );
      const res = await this.sns.publish(payload).promise();
      console.log('sns resp ==> ', res);
    }
  }

  parseDispute(data: Dispute): string {
    if (!data) return '';
    const { disputeItems } = data;
    const items = JSON.parse(disputeItems) as DisputeItem[];
    return items.map(this.parseDisputeResult).join('');
  }

  parseDisputeResult(item: DisputeItem): string {
    const reasons = _nest.find<DisputeReason[]>(item, 'reasons');
    if (!reasons) return '';
    return this.parseDisputeDataReasons(reasons);
  }

  parseDisputeDataReasons(reasons: DisputeReason[]): any {
    return reasons
      .map((reason, idx) => {
        const str = Object.entries(reason)
          .map(([k, v]) => `${k}:${v}`)
          .join(',');
        return `Reason-${idx + 1}::${str}`;
      })
      .join(';');
  }

  async queryCBReport(userId: string, cbID: string | null): Promise<CreditBureauReportResult | null> {
    if (!cbID) return null;
    try {
      return await getCreditBureauReportResult(cbID, userId);
    } catch (err) {
      return null;
    }
  }

  parseCBFinding(data: CreditBureauReportResult): any {
    if (!data) return;
    const { record } = data;
    const creditBureau = JSON.parse(record) as IDisputeCreditBureau;
    const prodArray = _.castArray(_nest.find<IProductArray | IProductArray[]>(creditBureau, 'productArray'));
    return this.parseSubjectRecord(prodArray);
  }

  parseSubjectRecord(arr: IProductArray[]): string {
    return arr
      .map((i) => {
        const disclosure = _nest.find<IDisclosureCoverInfo>(i, 'disclosureCoverInfo');
        const lineItems = _.castArray(_nest.find<ILineItem | ILineItem[]>(disclosure, 'lineItem'));
        return lineItems
          .map((item, idx) => {
            if (!item?.credit) return '';
            const { credit } = item;
            return `Result-${idx}::item:${credit.item?.itemName},result:${credit.result}`;
          })
          .join(';');
      })
      .join('');
  }
}
