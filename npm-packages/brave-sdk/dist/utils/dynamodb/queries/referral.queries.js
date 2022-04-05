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
exports.ReferralQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const referral_1 = require("../../../models/referral/referral");
class ReferralQueries {
    constructor() { }
    static getReferral(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(id).exec();
        });
    }
    static listReferrals() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().execFetchAll();
        });
    }
    static createReferral(referral) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(referral).ifNotExists().exec();
        });
    }
    static updateReferral(referral) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(referral).exec();
        });
    }
    static updateEnrollment(pkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.update(pkey).updateAttribute('enrolled').set(true).returnValues('ALL_NEW').exec();
        });
    }
    static updatePaidOut(pkey, paidOut) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.update(pkey).updateAttribute('campaignActivePaid').set(paidOut).exec();
        });
    }
    static updateAddOn(pkey, addOn) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store
                .update(pkey)
                .updateAttribute('campaignActiveAddOn')
                .set(addOn)
                .updateAttribute('totalAddOn')
                .incrementBy(addOn)
                .exec();
        });
    }
    static updateNextPaymentDate(pkey, paymentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.update(pkey).updateAttribute('nextPaymentDate').set(paymentDate).exec();
        });
    }
    static suspendReferral(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.update(id).updateAttribute('suspended').set(true).exec();
        });
    }
    static getActiveCampaignReferrals(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().index(referral_1.CAMPAIGNACTIVE_GSI).wherePartitionKey(campaign).execFetchAll();
        });
    }
    static getEligibileReferrals() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().index(referral_1.ELIGIBLE_GSI).wherePartitionKey(1).execFetchAll();
        });
    }
    static getReferralByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code)
                return Promise.resolve(null);
            return this.store.query().index(referral_1.REFERRAL_CODE_GSI).wherePartitionKey(code).execSingle();
        });
    }
    static updateReferralEligibility(id, eligibility) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.update(id).updateAttribute('eligible').set(eligibility).exec();
        });
    }
    static updateReferralCampaign(id, campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            return this.store
                .update(id)
                .updateAttribute('campaignActive')
                .set(campaign)
                .updateAttribute('modifiedOn')
                .set(now)
                .exec();
        });
    }
    static batchDeleteReferrals(records) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.batchWrite().delete(records).exec();
        });
    }
}
exports.ReferralQueries = ReferralQueries;
ReferralQueries.store = new dynamo_easy_1.DynamoStore(referral_1.Referral);
