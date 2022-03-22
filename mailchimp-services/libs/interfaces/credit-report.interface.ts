import { IMergeReport } from 'libs/interfaces/mergereport.interface';

export interface CreditReport {
  userId: string;
  version: number;
  currentVersion: number | undefined;
  bureau: string;
  report: IMergeReport;
  createdOn: string | null;
  modifiedOn: string | null;
}
