import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { OpsReport } from '../../../models/ops-report/ops-reports';
export declare class OpsReportQueries {
    static store: DynamoStore<OpsReport>;
    constructor();
    static listOpsReportsByBatch(batchId: string, reportId: string): Promise<OpsReport[]>;
    static listOpsReportByReportId(reportId: string): Promise<OpsReport[]>;
    static createOpReport(opsReport: OpsReport): Promise<void>;
    static deleteOpsReport(reportId: string): Promise<OpsReport>;
    static batchDeleteOpsReport(records: OpsReport[]): Promise<void>;
}
