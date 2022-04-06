/*===============================*/
/*           general             */
/*===============================*/
export type CreditMixStatus = 'semicritical' | 'danger' | 'normal' | 'safe';
export type CreditUtilizationStatus = 'critical' | 'semicritical' | 'danger' | 'normal' | 'safe';
export type NegativeAccountStatus = 'critical' | 'safe';
export type ForbearanceStatus = 'danger' | 'safe';
export type DatabreachStatus = 'danger' | 'safe';

/*===============================*/
/*           credit mix          */
/*===============================*/
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
