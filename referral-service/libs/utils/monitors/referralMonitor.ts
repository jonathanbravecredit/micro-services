import { DynamoDBRecord, SNSEventRecord } from 'aws-lambda';
import { ISession } from 'libs/interfaces/api/sessions/session.interface';
import { DynamoDBorSNSRecord } from 'libs/interfaces/aws/dynamo-sns.interface';
import { SnsMessage } from 'libs/interfaces/aws/sns-message.interface';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { ReferralActivationManager } from 'libs/utils/managers/referralActivationManager';
import { ReferralAggregationManager } from 'libs/utils/managers/referralAggregationManager';
import { ReferralSuspensionManager } from 'libs/utils/managers/referralSuspensionManager';

export class ReferralMonitor {
  public campaign: Campaign | null = null;
  public snsRecords: SNSEventRecord[] = [];
  public dynamoRecords: DynamoDBRecord[] = [];

  constructor(public records: DynamoDBorSNSRecord[]) {}

  async init(): Promise<void> {
    console.log('monitor records: ', JSON.stringify(this.records));
    this.campaign = await this.getCampaign();
    this.segmentRecords();
  }

  segmentRecords(): void {
    this.records.forEach((r: DynamoDBorSNSRecord) => {
      if ((r as DynamoDBRecord).eventSource === 'aws:dynamodb') {
        this.dynamoRecords = [...this.dynamoRecords, r as DynamoDBRecord];
      }
      if ((r as SNSEventRecord).EventSource === 'aws:sns') {
        const subj = (r as SNSEventRecord).Sns?.Subject;
        const msg = (r as SNSEventRecord).Sns?.Message;
        if (!subj || !msg) return;
        const t1 = subj === 'sessiondataupdate' || subj === 'transunionenrollment';
        const { service } = JSON.parse(msg) as SnsMessage<ISession>;
        const t2 = service === 'referralservice';
        if (t1 && t2) {
          this.snsRecords = [...this.snsRecords, r as SNSEventRecord];
        }
      }
    });
  }

  async monitor(): Promise<void> {
    try {
      await this.monitorDynamo();
      await this.monitorSns();
    } catch (err) {
      console.error(err);
    }
  }

  async monitorDynamo(): Promise<void> {
    try {
      await Promise.all(
        this.dynamoRecords.map(async (rec) => {
          try {
            await this.checkSuspensions(rec);
            await this.checkAggregations(rec);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async monitorSns(): Promise<void> {
    try {
      await Promise.all(
        this.snsRecords.map(async (rec) => {
          try {
            await this.checkActivations(rec);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async checkSuspensions(rec: DynamoDBRecord): Promise<void> {
    try {
      const manager = new ReferralSuspensionManager(rec);
      await manager.handleSuspensions();
    } catch (err) {
      console.error(err);
    }
  }
  async checkAggregations(rec: DynamoDBRecord): Promise<void> {
    if (!this.campaign) return;
    try {
      const aggregator = new ReferralAggregationManager(this.campaign, rec);
      await aggregator.quantifyReferral();
    } catch (err) {
      console.error(err);
    }
  }

  async checkActivations(rec: SNSEventRecord): Promise<any> {
    const subj = rec.Sns?.Subject as 'sessiondataupdate' | 'transunionenrollment' | unknown;
    if (subj !== 'sessiondataupdate' && subj !== 'transunionenrollment') return;
    try {
      const manager = new ReferralActivationManager(rec, subj);
      await manager.init();
      await manager.check();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async getCampaign(): Promise<Campaign | null> {
    return await getCampaign(1, 0);
  }
}
