"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionQueries = void 0;
const transunion_dispute_queries_1 = require("./transunion-dispute-queries");
const transunion_exception_queries_1 = require("./transunion-exception-queries");
const transunion_report_queries_1 = require("./transunion-report-queries");
class TransunionQueries {
    constructor() { }
}
exports.TransunionQueries = TransunionQueries;
TransunionQueries.dispute = transunion_dispute_queries_1.TransunionDisputeQueries;
TransunionQueries.report = transunion_report_queries_1.TransunionReportQueries;
TransunionQueries.exceptions = transunion_exception_queries_1.TransunionExceptionQueries;
