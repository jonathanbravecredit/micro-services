import { IMergeReport } from 'lib/interfaces/mergereport.interface';

export interface CreditReport {
  userId: string;
  version: number;
  currentVersion: number | undefined;
  bureau: string;
  report: IMergeReport;
  createdOn: string | null;
  modifiedOn: string | null;
}
