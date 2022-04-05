import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Referral } from '../../../models/referral/referral';
export declare class ReferralQueries {
    static store: DynamoStore<Referral>;
    constructor();
    static getReferral(id: string): Promise<Referral | null>;
    static listReferrals(): Promise<Referral[]>;
    static createReferral(referral: Referral): Promise<void>;
    static updateReferral(referral: Referral): Promise<void>;
    static updateEnrollment(pkey: string): Promise<Referral>;
    static updatePaidOut(pkey: string, paidOut: number): Promise<void>;
    static updateAddOn(pkey: string, addOn: number): Promise<void>;
    static updateNextPaymentDate(pkey: string, paymentDate: string): Promise<void>;
    static suspendReferral(id: string): Promise<void>;
    static getActiveCampaignReferrals(campaign: string): Promise<Referral[]>;
    static getEligibileReferrals(): Promise<Referral[]>;
    static getReferralByCode(code: string | null): Promise<Referral | null>;
    static updateReferralEligibility(id: string, eligibility: 1 | 0): Promise<void>;
    static updateReferralCampaign(id: string, campaign: string): Promise<void>;
    static batchDeleteReferrals(records: Referral[]): Promise<any>;
}
