export interface IGetEarningReferral {
    id: string;
}

export interface IGetEarningReferralMonthly extends IGetEarningReferral {
    month?: string;
    year?: string;
}
