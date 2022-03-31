import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { OpsReport, BATCHID_REPORTID_INDEX } from '../models/ops-reports';

const store = new DynamoStore(OpsReport);

export class OpsReportQueries {
  static store = new DynamoStore(OpsReport);
  constructor() {}

  static async listOpsReportsByBatch(batchId: string, reportId: string): Promise<OpsReport[]> {
    return this.store
      .query()
      .index(BATCHID_REPORTID_INDEX)
      .wherePartitionKey(batchId)
      .whereSortKey()
      .equals(reportId)
      .execFetchAll();
  }

  static async listOpsReportByReportId(reportId: string): Promise<OpsReport[]> {
    return this.store.query().wherePartitionKey(reportId).execFetchAll();
  }

  static async createOpReport(opsReport: OpsReport): Promise<void> {
    return this.store.put(opsReport).ifNotExists().exec();
  }

  static async deleteOpsReport(reportId: string): Promise<OpsReport> {
    return this.store.delete(reportId).returnValues('ALL_OLD').exec();
  }

  static async batchDeleteOpsReport(records: OpsReport[]): Promise<void> {
    return this.store.batchWrite().delete(records).exec();
  }
}
