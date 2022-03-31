/*===============================*/
/*           general             */
/*===============================*/
export const enum MetricIds {
  CreditMix = 'credit_mix',
  CreditUtilization = 'credit_utilization',
  NegativeAccounts = 'negative_accounts',
  Forbearance = 'forbearance',
  Databreaches = 'databreaches',
}

export const enum MetricLabels {
  CreditMix = 'Credit Mix',
  CreditUtilization = 'Credit Utilization',
  NegativeAccounts = 'Negative Accounts',
  Forbearance = 'COVID-19 Loan Relief',
  Databreaches = 'Data Breach & Leaks Tracker',
}

export type CreditMixStatus = 'semicritical' | 'danger' | 'normal' | 'safe';
export type CreditUtilizationStatus = '';
export type NegativeAccountStatus = 'critical' | 'safe';

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
