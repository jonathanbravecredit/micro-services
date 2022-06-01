import 'reflect-metadata';
import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { v4 } from 'uuid';

export const BATCHID_REPORTID_INDEX = 'batchIdReportId-index';

@Model({ tableName: 'OpsReports' })
export class OpsReport {
  @PartitionKey()
  @GSISortKey(BATCHID_REPORTID_INDEX)
  reportId!: string;
  @SortKey()
  recordId!: string;
  @GSIPartitionKey(BATCHID_REPORTID_INDEX)
  batchId!: string;
  schema!: string;
  record!: string;
  createdOn!: string;
  modifiedOn!: string;
}

export class OpsReportMaker implements OpsReport {
  reportId: string;
  recordId: string;
  batchId: string;
  schema: string;
  record: string;
  createdOn: string;
  modifiedOn: string;

  constructor(reportId: string, batchId: string, schema: string, record: string) {
    this.reportId = reportId;
    this.recordId = v4();
    this.batchId = batchId;
    this.schema = schema;
    this.record = record;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
