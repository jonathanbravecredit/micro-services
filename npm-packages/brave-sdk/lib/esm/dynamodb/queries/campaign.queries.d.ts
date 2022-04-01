import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Campaign } from '../models/campaign.model';
export declare class CampaignQueries {
    static store: DynamoStore<Campaign>;
    constructor();
    static getCampaign(pkey: number, skey: number): Promise<Campaign | null>;
    static listCampaigns(): Promise<Campaign[]>;
    static createCampaign(campaign: Campaign): Promise<void>;
    static updateCurrentCampaign(campaign: Campaign): Promise<void>;
    static getLatestCampaign(pkey: number): Promise<Campaign[]>;
}
