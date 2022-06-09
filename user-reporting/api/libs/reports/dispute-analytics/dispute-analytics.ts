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
import { getCreditBureauReportResult } from 'libs/queries/credit-bureau-report-results.queries';
import { Dispute } from 'libs/models/dispute.model';
import { ReportBase } from 'libs/reports/ReportBase';
import { Nested as _nest, OpsReportMaker, OpsReportQueries } from '@bravecredit/brave-sdk';
import { DisputeItem, DisputeReason } from 'libs/interfaces/dispute-items';

export class DisputeAnalyticsReport extends ReportBase<IBatchMsg<IAttributeValue> | undefined> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
    _.bindAll(this, ['parseDisputeResult', 'parseDisputeDataReasons']);
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
        console.log('ids: ', cbID, userId);
        try {
          const cbData = await this.queryCBReport(userId, cbID);
          console.log('cbData', JSON.stringify(cbData));
          const results = cbData ? this.parseCBFinding(cbData) : '';
          const type = this.getDisputeType(reasons);
          const enriched = {
            ...this.mapDisputeRecords(record),
            type,
            reasons,
            results,
          };
          const ops = new OpsReportMaker(
            ReportNames.DisputeAnalytics,
            batchId,
            JSON.stringify(schema),
            JSON.stringify(enriched),
          );
          await OpsReportQueries.createOpReport(ops);
          this.counter++;
          return true;
        } catch (err) {
          console.error(err);
        }
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
    if (!disputeItems) return '';
    if (typeof disputeItems == 'string') {
      const items = JSON.parse(disputeItems) as DisputeItem[];
      return items.map(this.parseDisputeResult).join('');
    } else {
      return '';
    }
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
          .join(';');
        return `::Reason-${idx + 1}::${str.trim()}`;
      })
      .join('');
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
    if (!record) return '';
    if (typeof record == 'string') {
      const creditBureau = JSON.parse(record) as IDisputeCreditBureau;
      const prodArray = _.castArray(_nest.find<IProductArray | IProductArray[]>(creditBureau, 'productArray'));
      return this.parseSubjectRecord(prodArray);
    } else {
      return '';
    }
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
            return `::Result-${idx + 1}::result:${credit.result?.trim()}`;
          })
          .join('');
      })
      .join('');
  }

  getDisputeType(reason: string): string {
    if (reason.includes('pi-')) return 'Personal';
    if (reason.includes('pr-')) return 'Public Item';
    if (!reason.includes('pr-') && !reason.includes('pi-') && reason.includes('Reason-')) return 'Tradeline Item';
    return 'unknown';
  }

  mapDisputeRecords(item: Dispute): Partial<Dispute> {
    const { id, disputeId, agencyName, disputeStatus, openedOn, closedOn } = item;
    return {
      id,
      disputeId,
      agencyName,
      disputeStatus,
      openedOn,
      closedOn,
    };
  }
}
