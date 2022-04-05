export declare type CreditMixStatus = 'semicritical' | 'danger' | 'normal' | 'safe';
export declare type CreditUtilizationStatus = 'critical' | 'semicritical' | 'danger' | 'normal' | 'safe';
export declare type NegativeAccountStatus = 'critical' | 'safe';
export declare type ForbearanceStatus = 'danger' | 'safe';
export declare type DatabreachStatus = 'danger' | 'safe';
export interface TCreditMixCalcObj {
    string?: string;
    color?: string;
}
export interface ICreditMixTLSummary {
    hasCreditCards: boolean;
    hasStudentLoans: boolean;
    hasAutoLoans: boolean;
    hasMortgages: boolean;
    hasOpenCreditCards: boolean;
    hasOpenStudentLoans: boolean;
    hasOpenAutoLoans: boolean;
    hasOpenMortgages: boolean;
    totalLineAmount: number;
    creditCardAmount: number;
    amountOfOpenCreditCards: number;
    studentLoanAmount: number;
    autoLoanAmount: number;
    mortgageAmount: number;
    amountOfClosed: number;
}
export interface IRecommendationText {
    link?: string;
    text?: string;
    subtext?: string;
    rating?: string;
    color?: string;
}
