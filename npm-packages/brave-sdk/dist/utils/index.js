"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInitiativeQueries = exports.SessionQueries = exports.ReferralQueries = exports.OpsReportQueries = exports.InvestigationResultQueries = exports.CreditScoreQueries = exports.CreditReportQueries = exports.CampaignQueries = exports.APITransactionLogQueries = exports.APIErrorLogQueries = exports.AnalyticQueries = exports.AdsQueries = exports.Nested = exports.Homogenize = void 0;
var homogenize_data_1 = require("./homogenize/homogenize-data");
Object.defineProperty(exports, "Homogenize", { enumerable: true, get: function () { return homogenize_data_1.Homogenize; } });
var nested_1 = require("./nested/nested");
Object.defineProperty(exports, "Nested", { enumerable: true, get: function () { return nested_1.Nested; } });
var dynamodb_1 = require("./dynamodb");
Object.defineProperty(exports, "AdsQueries", { enumerable: true, get: function () { return dynamodb_1.AdsQueries; } });
Object.defineProperty(exports, "AnalyticQueries", { enumerable: true, get: function () { return dynamodb_1.AnalyticQueries; } });
Object.defineProperty(exports, "APIErrorLogQueries", { enumerable: true, get: function () { return dynamodb_1.APIErrorLogQueries; } });
Object.defineProperty(exports, "APITransactionLogQueries", { enumerable: true, get: function () { return dynamodb_1.APITransactionLogQueries; } });
Object.defineProperty(exports, "CampaignQueries", { enumerable: true, get: function () { return dynamodb_1.CampaignQueries; } });
Object.defineProperty(exports, "CreditReportQueries", { enumerable: true, get: function () { return dynamodb_1.CreditReportQueries; } });
Object.defineProperty(exports, "CreditScoreQueries", { enumerable: true, get: function () { return dynamodb_1.CreditScoreQueries; } });
Object.defineProperty(exports, "InvestigationResultQueries", { enumerable: true, get: function () { return dynamodb_1.InvestigationResultQueries; } });
Object.defineProperty(exports, "OpsReportQueries", { enumerable: true, get: function () { return dynamodb_1.OpsReportQueries; } });
Object.defineProperty(exports, "ReferralQueries", { enumerable: true, get: function () { return dynamodb_1.ReferralQueries; } });
Object.defineProperty(exports, "SessionQueries", { enumerable: true, get: function () { return dynamodb_1.SessionQueries; } });
Object.defineProperty(exports, "UserInitiativeQueries", { enumerable: true, get: function () { return dynamodb_1.UserInitiativeQueries; } });