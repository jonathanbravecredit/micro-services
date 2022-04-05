"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionParsers = void 0;
const transunion_report_parsers_1 = require("./transunion-report-parsers");
const transunion_dispute_parsers_1 = require("./transunion-dispute-parsers");
const transunion_onboarding_parsers_1 = require("./transunion-onboarding-parsers");
class TransunionParsers {
}
exports.TransunionParsers = TransunionParsers;
TransunionParsers.report = transunion_report_parsers_1.TransunionReportParsers;
TransunionParsers.dispute = transunion_dispute_parsers_1.TransunionDisputeParsers;
TransunionParsers.onboarding = transunion_onboarding_parsers_1.TransunionOnboardingParsers;
