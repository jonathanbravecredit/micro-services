export interface IUserSummaryMappedValues {
  userId: string;
  userAge?: number;
  userDOB?: string;
  userState: string;
  userZipCode: string;
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
}
