"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionParsers = void 0;
const _1 = require(".");
const transunion_missing_1 = require("../transunion-missing");
const transunion_onboarding_parsers_1 = require("./transunion-onboarding-parsers");
class TransunionParsers extends transunion_missing_1.TransunionMissing {
    constructor() {
        super();
    }
}
exports.TransunionParsers = TransunionParsers;
TransunionParsers.dispute = _1.TransunionDisputeParsers;
TransunionParsers.report = _1.TransunionReportParsers;
TransunionParsers.onboarding = transunion_onboarding_parsers_1.TransunionOnboardingParsers;
