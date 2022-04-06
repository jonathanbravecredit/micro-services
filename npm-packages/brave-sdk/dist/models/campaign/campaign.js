"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignMaker = exports.Campaign = exports.CAMPAIGNSTATUS_INDEX = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
exports.CAMPAIGNSTATUS_INDEX = 'campaignStatus-index';
let Campaign = class Campaign {
    constructor() {
        this.currentVersion = 0;
        this.campaign = 'NO_CAMPAIGN';
        this.denomination = 0;
        this.maxReferrals = 10;
        this.bonusThreshold = 9999;
        this.bonusAmount = 0;
        this.addOnFlagOne = '';
        this.addOnFlagTwo = '';
        this.addOnFlagThree = '';
        this.startDate = '';
        this.endDate = '';
    }
};
__decorate([
    (0, dynamo_easy_1.PartitionKey)(),
    __metadata("design:type", Number)
], Campaign.prototype, "pKey", void 0);
__decorate([
    (0, dynamo_easy_1.SortKey)(),
    __metadata("design:type", Number)
], Campaign.prototype, "version", void 0);
Campaign = __decorate([
    (0, dynamo_easy_1.Model)({ tableName: 'Campaigns' })
], Campaign);
exports.Campaign = Campaign;
class CampaignMaker {
    constructor(version, campaign, denomination, maxReferrals, bonusThreshold, addOnFlagOne, addOnFlagTwo, addOnFlagThree, startDate, endDate) {
        this.pKey = 1;
        this.currentVersion = 0;
        this.campaign = 'NO_CAMPAIGN';
        this.denomination = 0;
        this.maxReferrals = 10;
        this.bonusThreshold = 9999;
        this.bonusAmount = 0;
        this.addOnFlagOne = '';
        this.addOnFlagTwo = '';
        this.addOnFlagThree = '';
        this.startDate = '';
        this.endDate = '';
        this.version = version;
        this.campaign = campaign;
        this.denomination = denomination;
        this.maxReferrals = maxReferrals;
        this.bonusThreshold = bonusThreshold;
        this.addOnFlagOne = addOnFlagOne;
        this.addOnFlagTwo = addOnFlagTwo;
        this.addOnFlagThree = addOnFlagThree;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdOn = new Date().toISOString();
        this.modifiedOn = new Date().toISOString();
    }
}
exports.CampaignMaker = CampaignMaker;
