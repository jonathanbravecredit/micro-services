import 'reflect-metadata';
export declare const CAMPAIGNSTATUS_INDEX = "campaignStatus-index";
export declare class Campaign {
    pKey: number;
    version: number;
    currentVersion: number;
    campaign: string;
    denomination: number;
    maxReferrals: number;
    bonusThreshold: number;
    bonusAmount: number;
    addOnFlagOne: string;
    addOnFlagTwo: string;
    addOnFlagThree: string;
    startDate: string;
    endDate: string;
    createdOn: string | undefined;
    modifiedOn: string | undefined;
}
export declare class CampaignMaker implements Campaign {
    pKey: number;
    version: number;
    currentVersion: number;
    campaign: string;
    denomination: number;
    maxReferrals: number;
    bonusThreshold: number;
    bonusAmount: number;
    addOnFlagOne: string;
    addOnFlagTwo: string;
    addOnFlagThree: string;
    startDate: string;
    endDate: string;
    createdOn: string | undefined;
    modifiedOn: string | undefined;
    constructor(version: number, campaign: string, denomination: number, maxReferrals: number, bonusThreshold: number, addOnFlagOne: string, addOnFlagTwo: string, addOnFlagThree: string, startDate: string, endDate: string);
}
