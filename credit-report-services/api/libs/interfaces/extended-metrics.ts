export interface IExtendedMetrics {
  userId: string | null;
  creditScore: number;
  countAllAccounts: number;
  sumAllBalances: number;
  countOpenAccounts: number;
  sumOpenBalances: number;
  countDerogatoryAccounts: number;
  countPublicRecordAccounts: number;
  ageOfOldestTradeline: string;
  countOpenInstallmentAccounts: number;
  sumOpenInstallmentBalances: number;
  countOpenRealEstateAccounts: number;
  sumOpenRealEstateBalances: number;
  countOpenRevolvingAccounts: number;
  sumOpenRevolvingBalances: number;
  countOpenCollectionAccounts: number;
  sumOpenCollectionBalances: number;
  countOpenStudentLoanAccounts: number;
  sumOpenStudentLoanBalances: number;
  countOpenOtherAccounts: number;
  sumOpenOtherBalances: number;
  haveSelfLoan: boolean;
}
