"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionQueries = void 0;
const transunion_report_queries_1 = require("./transunion-report-queries");
const transunion_dispute_queries_1 = require("./transunion-dispute-queries");
const transunion_exception_queries_1 = require("./transunion-exception-queries");
class TransunionQueries {
    constructor() { }
}
exports.TransunionQueries = TransunionQueries;
TransunionQueries.report = transunion_report_queries_1.TransunionReportQueries;
TransunionQueries.dispute = transunion_dispute_queries_1.TransunionDisputeQueries;
TransunionQueries.exceptions = transunion_exception_queries_1.TransunionExceptionQueries;
