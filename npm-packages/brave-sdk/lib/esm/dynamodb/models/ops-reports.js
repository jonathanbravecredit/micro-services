var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'reflect-metadata';
import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
export const BATCHID_REPORTID_INDEX = 'batchIdReportId-index';
let OpsReport = class OpsReport {
};
__decorate([
    PartitionKey(),
    GSISortKey(BATCHID_REPORTID_INDEX),
    __metadata("design:type", String)
], OpsReport.prototype, "reportId", void 0);
__decorate([
    SortKey(),
    __metadata("design:type", String)
], OpsReport.prototype, "recordId", void 0);
__decorate([
    GSIPartitionKey(BATCHID_REPORTID_INDEX),
    __metadata("design:type", String)
], OpsReport.prototype, "batchId", void 0);
OpsReport = __decorate([
    Model({ tableName: 'OpsReports' })
], OpsReport);
export { OpsReport };
export class OpsReportMaker {
    constructor(reportId, batchId, schema, record) {
        this.reportId = reportId;
        this.recordId = new Date().toISOString();
        this.batchId = batchId;
        this.schema = schema;
        this.record = record;
        this.createdOn = new Date().toISOString();
        this.modifiedOn = new Date().toISOString();
    }
}
