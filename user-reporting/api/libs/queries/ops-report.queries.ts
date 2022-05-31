import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { BATCHID_REPORTID_INDEX, OpsReport } from 'libs/models/ops-reports';

const store = new DynamoStore(OpsReport);

export const listOpsReportsByBatch = (batchId: string, reportId: string): Promise<OpsReport[]> => {
  console.log('batchId ===> ', batchId);
  console.log('reportId ===> ', reportId);
  return store
    .query()
    .index(BATCHID_REPORTID_INDEX)
    .wherePartitionKey(batchId)
    .whereSortKey()
    .equals(reportId)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => {
      console.log('list error ==> ', err);
      return err;
    });
};

export const listOpsReportByReportId = (reportId: string): Promise<OpsReport[]> => {
  return store
    .query()
    .wherePartitionKey(reportId)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createOpReport = (opsReport: OpsReport): Promise<void> => {
  return store
    .put(opsReport)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteOpsReport = (reportId: string): Promise<OpsReport> => {
  return store
    .delete(reportId)
    .returnValues('ALL_OLD')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const batchDeleteOpsReport = (records: OpsReport[]): Promise<any> => {
  return store
    .batchWrite()
    .delete(records)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('batch delete error ==> ', err);
      return err;
    });
};
