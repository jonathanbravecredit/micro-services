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
exports.ReferralMaker = exports.Referral = exports.ELIGIBLE_GSI = exports.CAMPAIGNACTIVE_GSI = exports.REFERRAL_CODE_GSI = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
exports.REFERRAL_CODE_GSI = 'referralCode-index';
exports.CAMPAIGNACTIVE_GSI = 'campaignActive-index';
exports.ELIGIBLE_GSI = 'eligible-index';
let Referral = class Referral {
    constructor() {
        this.eligible = 0;
        this.enrolled = false;
        this.suspended = false;
        this.totalReferred = 0;
        this.totalEarned = 0;
        this.totalBonus = 0;
        this.totalAddOn = 0;
        this.campaignActive = '';
        this.campaignActiveReferred = 0;
        this.campaignActiveEarned = 0;
        this.campaignActivePaid = 0;
        this.campaignActiveAddOn = 0;
        this.campaignActiveBonus = 0;
        this.campaignPrior = '';
        this.campaignPriorReferred = 0;
        this.campaignPriorEarned = 0;
        this.campaignPriorPaid = 0;
        this.campaignPriorAddOn = 0;
        this.campaignPriorBonus = 0;
        this.nextPaymentDate = '';
        this.notified = false;
    }
};
__decorate([
    dynamo_easy_1.PartitionKey(),
    __metadata("design:type", String)
], Referral.prototype, "id", void 0);
__decorate([
    dynamo_easy_1.GSIPartitionKey(exports.REFERRAL_CODE_GSI),
    __metadata("design:type", String)
], Referral.prototype, "referralCode", void 0);
__decorate([
    dynamo_easy_1.GSIPartitionKey(exports.ELIGIBLE_GSI),
    __metadata("design:type", Number)
], Referral.prototype, "eligible", void 0);
__decorate([
    dynamo_easy_1.GSIPartitionKey(exports.CAMPAIGNACTIVE_GSI),
    __metadata("design:type", String)
], Referral.prototype, "campaignActive", void 0);
Referral = __decorate([
    dynamo_easy_1.Model({ tableName: 'Referrals' })
], Referral);
exports.Referral = Referral;
class ReferralMaker {
    constructor(id, referralCode, referredByCode, referredById) {
        this.eligible = 0;
        this.enrolled = false;
        this.suspended = false;
        this.totalReferred = 0;
        this.totalEarned = 0;
        this.totalBonus = 0;
        this.totalAddOn = 0;
        this.campaignActive = 'NO_CAMPAIGN';
        this.campaignActiveReferred = 0;
        this.campaignActiveEarned = 0;
        this.campaignActivePaid = 0;
        this.campaignActiveAddOn = 0;
        this.campaignActiveBonus = 0;
        this.campaignPrior = '';
        this.campaignPriorReferred = 0;
        this.campaignPriorEarned = 0;
        this.campaignPriorPaid = 0;
        this.campaignPriorAddOn = 0;
        this.campaignPriorBonus = 0;
        this.nextPaymentDate = '';
        this.notified = false;
        this.id = id;
        this.referralCode = referralCode;
        this.referredByCode = referredByCode;
        this.referredById = referredById;
        this.createdOn = new Date().toISOString();
        this.modifiedOn = new Date().toISOString();
    }
    getReferredById() {
        // add in logic here to look up the referred by code
    }
    setCampaign(campaign) {
        this.campaignActive = campaign;
    }
    enable() {
        this.eligible = 1;
        this.enrolled = true;
    }
}
exports.ReferralMaker = ReferralMaker;
