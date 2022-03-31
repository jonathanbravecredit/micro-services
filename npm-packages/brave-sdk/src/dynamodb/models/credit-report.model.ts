import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { MergeReport } from '../../creditreport/merge-report/merge-report';
import { CreditReportMetrics } from '../../creditreport/credit-report-metrics/credit-report-metrics';

@Model({ tableName: 'CreditReports' })
export class CreditReport {
  @PartitionKey()
  userId!: string;

  @SortKey()
  version!: number;

  currentVersion: number | undefined;

  bureau!: string;

  report!: MergeReport;

  metrics: CreditReportMetrics[] = [];

  createdOn: string | null = null;

  modifiedOn: string | null = null;
}

export class CreditReportMaker implements CreditReport {
  createdOn: string | null;
  modifiedOn: string | null;
  currentVersion: number | undefined;
  metrics: CreditReportMetrics[] = [];

  constructor(
    public userId: string,
    public bureau: string,
    public report: MergeReport,
    public version: number = new Date().valueOf(),
  ) {
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }

  setCurrentVersion(val: number) {
    this.currentVersion = val;
  }
}
