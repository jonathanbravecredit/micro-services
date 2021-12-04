export interface IGetEarningReferralSummary {
    earnings: string;
    enrolledmentDate: string;
    currency: string;
}

export interface IGetEarningReferralMonthlySummary {
    earnings: string;
    enrolledmentDate: string;
    currency: string;
    month: number;
    year: number;
}
