import 'reflect-metadata';
export declare const BATCHID_REPORTID_INDEX = "batchIdReportId-index";
export declare class OpsReport {
    reportId: string;
    recordId: string;
    batchId: string;
    schema: string;
    record: string;
    createdOn: string;
    modifiedOn: string;
}
export declare class OpsReportMaker implements OpsReport {
    reportId: string;
    recordId: string;
    batchId: string;
    schema: string;
    record: string;
    createdOn: string;
    modifiedOn: string;
    constructor(reportId: string, batchId: string, schema: string, record: string);
}
