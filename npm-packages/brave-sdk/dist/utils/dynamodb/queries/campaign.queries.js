"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const campaign_1 = require("../../../models/campaign/campaign");
class CampaignQueries {
    constructor() { }
    static getCampaign(pkey, skey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(pkey, skey).exec();
        });
    }
    static listCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().execFetchAll();
        });
    }
    static createCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(campaign).ifNotExists().exec();
        });
    }
    static updateCurrentCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            return this.store
                .update(1, 0)
                .updateAttribute('currentVersion')
                .set(campaign.currentVersion)
                .updateAttribute('campaign')
                .set(campaign.campaign)
                .updateAttribute('denomination')
                .set(campaign.denomination)
                .updateAttribute('bonusThreshold')
                .set(campaign.bonusThreshold)
                .updateAttribute('bonusAmount')
                .set(campaign.bonusAmount)
                .updateAttribute('addOnFlagOne')
                .set(campaign.addOnFlagOne || '')
                .updateAttribute('addOnFlagTwo')
                .set(campaign.addOnFlagTwo || '')
                .updateAttribute('addOnFlagThree')
                .set(campaign.addOnFlagThree || '')
                .updateAttribute('startDate')
                .set(campaign.startDate)
                .updateAttribute('endDate')
                .set(campaign.endDate)
                .updateAttribute('modifiedOn')
                .set(now)
                .exec();
        });
    }
    static getLatestCampaign(pkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(pkey).descending().limit(1).exec();
        });
    }
}
exports.CampaignQueries = CampaignQueries;
CampaignQueries.store = new dynamo_easy_1.DynamoStore(campaign_1.Campaign);
