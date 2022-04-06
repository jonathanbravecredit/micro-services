"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = exports.Summary = exports.TradeLinePartition = exports.TrueLinkCreditReportType = exports.MergeReport = exports.TRANSUNION_ERROR_CODES = exports.TRANSUNION_CRITICAL_ERRORS = exports.INVESTIGATION_RESULTS_CODE_MAPPING = exports.EXPERIAN_STATES = exports.KROGER_STATES = exports.STUDENT_LOAN_INDUSTRY_CODES = exports.FORBEARANCE_TYPE = exports.CREDIT_MIX_RECOMMENDATON_VALUES = exports.CREDIT_MIX_RECOMMENDATION_LOGIC = exports.CREDIT_MIX_CONDITIONS = exports.DATA_BREACH_CARDS = exports.BRAVE_ACCOUNT_TYPE = exports.PAY_STATUS_WARNINGS = exports.NEGATIVE_PAY_STATUS_CODES = exports.POSITIVE_PAY_STATUS_CODES = exports.LATE_PAY_STATUS_CODES = exports.REPOSSESSION_PAY_STATUS_CODE = exports.WAGE_EARNER_PAY_STATUS_CODES = exports.COLLECTION_PAY_STATUS_CODES = exports.LATE_120_STATUS_CODE = exports.LATE_90_STATUS_CODE = exports.LATE_60_STATUS_CODE = exports.LATE_30_STATUS_CODE = exports.TOO_NEW_STATUS_CODE = exports.UNKNOWN_PAY_STATUS_CODES = exports.ONTIME_PAY_STATUS_CODES = exports.CREDIT_REPORT_GROUPS = exports.ACCOUNT_TYPES = exports.ADDRESS_LINE_2 = exports.ADDRESS_LINE_1 = exports.NAME_MAP = exports.PHONE_MAP = exports.TransunionErrorAction = exports.CreditReportGroups = exports.CreditMixRecommendationsCodes = exports.CreditMixRecommendations = exports.CreditBureauFindingsType = exports.ReportPartitions = exports.PassCodeQuestion = exports.OTPReponse = exports.OTPQuestion = exports.TUBundles = exports.TUStatusRefStatuses = exports.AccountTypes = exports.DataBreaches = void 0;
exports.SourceSummary = exports.Remark = exports.CreditAddress = exports.CodeRef = exports.BankingRecord = exports.Social = exports.SocialPartition = exports.PhoneNumber = exports.TUName = exports.Employer = exports.CreditStatement = exports.CreditScore = exports.CreditScoreFactor = exports.BorrowerTelephone = exports.BorrowerName = exports.BorrowerBureauIdentifier = exports.BorrowerBirth = exports.BorrowerAddress = exports.Inquiry = exports.TaxLien = exports.RegisteredItem = exports.PublicRecord = exports.MiscPublicRecord = exports.MaritalItem = exports.LegalItem = exports.Garnishment = exports.Foreclosure = exports.FinancingStatement = exports.FinancialCounseling = exports.Bankruptcy = exports.TradelineSummaryInfo = exports.TradelineSummary = exports.PublicRecordSummaryInfo = exports.PublicRecordSummary = exports.PortfolioCreditSummaryInfo = exports.PortfolioCreditSummary = exports.InquirySummaryInfo = exports.InquirySummary = exports.AccountHistorySummaryInfo = exports.AccountHistorySummary = exports.WatchTrade = exports.Tradeline = exports.PayStatusHistory = exports.MonthlyPayStatusItem = exports.GrantedTrade = exports.CollectionTrade = exports.BankingPartition = exports.Borrower = exports.PublicPartition = exports.SB168Frozen = void 0;
exports.UserInitiativeQueries = exports.SessionQueries = exports.ReferralQueries = exports.OpsReportQueries = exports.InvestigationResultQueries = exports.CreditScoreQueries = exports.CreditReportQueries = exports.CampaignQueries = exports.APITransactionLogQueries = exports.APIErrorLogQueries = exports.AnalyticQueries = exports.AdsQueries = exports.Nested = exports.Homogenize = exports.ModelAttributeTypes = exports.TransunionUtil = exports.Program = exports.Initiative = exports.UserInitiative = exports.SessionMaker = exports.Session = exports.ReferralMaker = exports.Referral = exports.OpsReportMaker = exports.OpsReport = exports.InvestigationResult = exports.CreditReportMetric = exports.CreditReportMetrics = exports.CreditUtilizationMetric = exports.CreditNegativeAccountsMetric = exports.CreditMixMetric = exports.CreditForbearanceMetric = exports.CreditDataBreachesMetric = exports.CreditReportMaker = exports.CreditReport = exports.CampaignMaker = exports.Campaign = exports.APITransactionLog = exports.APIErrorLog = exports.AnalyticMaker = exports.Analytic = exports.Ad = exports.TUDate = exports.Source = void 0;
/*======================*/
/*        constants     */
/*======================*/
var constants_1 = require("./constants");
Object.defineProperty(exports, "DataBreaches", { enumerable: true, get: function () { return constants_1.DataBreaches; } });
Object.defineProperty(exports, "AccountTypes", { enumerable: true, get: function () { return constants_1.AccountTypes; } });
Object.defineProperty(exports, "TUStatusRefStatuses", { enumerable: true, get: function () { return constants_1.TUStatusRefStatuses; } });
Object.defineProperty(exports, "TUBundles", { enumerable: true, get: function () { return constants_1.TUBundles; } });
Object.defineProperty(exports, "OTPQuestion", { enumerable: true, get: function () { return constants_1.OTPQuestion; } });
Object.defineProperty(exports, "OTPReponse", { enumerable: true, get: function () { return constants_1.OTPReponse; } });
Object.defineProperty(exports, "PassCodeQuestion", { enumerable: true, get: function () { return constants_1.PassCodeQuestion; } });
Object.defineProperty(exports, "ReportPartitions", { enumerable: true, get: function () { return constants_1.ReportPartitions; } });
Object.defineProperty(exports, "CreditBureauFindingsType", { enumerable: true, get: function () { return constants_1.CreditBureauFindingsType; } });
Object.defineProperty(exports, "CreditMixRecommendations", { enumerable: true, get: function () { return constants_1.CreditMixRecommendations; } });
Object.defineProperty(exports, "CreditMixRecommendationsCodes", { enumerable: true, get: function () { return constants_1.CreditMixRecommendationsCodes; } });
Object.defineProperty(exports, "CreditReportGroups", { enumerable: true, get: function () { return constants_1.CreditReportGroups; } });
Object.defineProperty(exports, "TransunionErrorAction", { enumerable: true, get: function () { return constants_1.TransunionErrorAction; } });
Object.defineProperty(exports, "PHONE_MAP", { enumerable: true, get: function () { return constants_1.PHONE_MAP; } });
Object.defineProperty(exports, "NAME_MAP", { enumerable: true, get: function () { return constants_1.NAME_MAP; } });
Object.defineProperty(exports, "ADDRESS_LINE_1", { enumerable: true, get: function () { return constants_1.ADDRESS_LINE_1; } });
Object.defineProperty(exports, "ADDRESS_LINE_2", { enumerable: true, get: function () { return constants_1.ADDRESS_LINE_2; } });
Object.defineProperty(exports, "ACCOUNT_TYPES", { enumerable: true, get: function () { return constants_1.ACCOUNT_TYPES; } });
Object.defineProperty(exports, "CREDIT_REPORT_GROUPS", { enumerable: true, get: function () { return constants_1.CREDIT_REPORT_GROUPS; } });
Object.defineProperty(exports, "ONTIME_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.ONTIME_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "UNKNOWN_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.UNKNOWN_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "TOO_NEW_STATUS_CODE", { enumerable: true, get: function () { return constants_1.TOO_NEW_STATUS_CODE; } });
Object.defineProperty(exports, "LATE_30_STATUS_CODE", { enumerable: true, get: function () { return constants_1.LATE_30_STATUS_CODE; } });
Object.defineProperty(exports, "LATE_60_STATUS_CODE", { enumerable: true, get: function () { return constants_1.LATE_60_STATUS_CODE; } });
Object.defineProperty(exports, "LATE_90_STATUS_CODE", { enumerable: true, get: function () { return constants_1.LATE_90_STATUS_CODE; } });
Object.defineProperty(exports, "LATE_120_STATUS_CODE", { enumerable: true, get: function () { return constants_1.LATE_120_STATUS_CODE; } });
Object.defineProperty(exports, "COLLECTION_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.COLLECTION_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "WAGE_EARNER_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.WAGE_EARNER_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "REPOSSESSION_PAY_STATUS_CODE", { enumerable: true, get: function () { return constants_1.REPOSSESSION_PAY_STATUS_CODE; } });
Object.defineProperty(exports, "LATE_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.LATE_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "POSITIVE_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.POSITIVE_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "NEGATIVE_PAY_STATUS_CODES", { enumerable: true, get: function () { return constants_1.NEGATIVE_PAY_STATUS_CODES; } });
Object.defineProperty(exports, "PAY_STATUS_WARNINGS", { enumerable: true, get: function () { return constants_1.PAY_STATUS_WARNINGS; } });
Object.defineProperty(exports, "BRAVE_ACCOUNT_TYPE", { enumerable: true, get: function () { return constants_1.BRAVE_ACCOUNT_TYPE; } });
Object.defineProperty(exports, "DATA_BREACH_CARDS", { enumerable: true, get: function () { return constants_1.DATA_BREACH_CARDS; } });
Object.defineProperty(exports, "CREDIT_MIX_CONDITIONS", { enumerable: true, get: function () { return constants_1.CREDIT_MIX_CONDITIONS; } });
Object.defineProperty(exports, "CREDIT_MIX_RECOMMENDATION_LOGIC", { enumerable: true, get: function () { return constants_1.CREDIT_MIX_RECOMMENDATION_LOGIC; } });
Object.defineProperty(exports, "CREDIT_MIX_RECOMMENDATON_VALUES", { enumerable: true, get: function () { return constants_1.CREDIT_MIX_RECOMMENDATON_VALUES; } });
Object.defineProperty(exports, "FORBEARANCE_TYPE", { enumerable: true, get: function () { return constants_1.FORBEARANCE_TYPE; } });
Object.defineProperty(exports, "STUDENT_LOAN_INDUSTRY_CODES", { enumerable: true, get: function () { return constants_1.STUDENT_LOAN_INDUSTRY_CODES; } });
Object.defineProperty(exports, "KROGER_STATES", { enumerable: true, get: function () { return constants_1.KROGER_STATES; } });
Object.defineProperty(exports, "EXPERIAN_STATES", { enumerable: true, get: function () { return constants_1.EXPERIAN_STATES; } });
Object.defineProperty(exports, "INVESTIGATION_RESULTS_CODE_MAPPING", { enumerable: true, get: function () { return constants_1.INVESTIGATION_RESULTS_CODE_MAPPING; } });
Object.defineProperty(exports, "TRANSUNION_CRITICAL_ERRORS", { enumerable: true, get: function () { return constants_1.TRANSUNION_CRITICAL_ERRORS; } });
Object.defineProperty(exports, "TRANSUNION_ERROR_CODES", { enumerable: true, get: function () { return constants_1.TRANSUNION_ERROR_CODES; } });
/*======================*/
/*        models         */
/*======================*/
var models_1 = require("./models");
Object.defineProperty(exports, "MergeReport", { enumerable: true, get: function () { return models_1.MergeReport; } });
Object.defineProperty(exports, "TrueLinkCreditReportType", { enumerable: true, get: function () { return models_1.TrueLinkCreditReportType; } });
Object.defineProperty(exports, "TradeLinePartition", { enumerable: true, get: function () { return models_1.TradeLinePartition; } });
Object.defineProperty(exports, "Summary", { enumerable: true, get: function () { return models_1.Summary; } });
Object.defineProperty(exports, "Subscriber", { enumerable: true, get: function () { return models_1.Subscriber; } });
Object.defineProperty(exports, "SB168Frozen", { enumerable: true, get: function () { return models_1.SB168Frozen; } });
Object.defineProperty(exports, "PublicPartition", { enumerable: true, get: function () { return models_1.PublicPartition; } });
Object.defineProperty(exports, "Borrower", { enumerable: true, get: function () { return models_1.Borrower; } });
Object.defineProperty(exports, "BankingPartition", { enumerable: true, get: function () { return models_1.BankingPartition; } });
Object.defineProperty(exports, "CollectionTrade", { enumerable: true, get: function () { return models_1.CollectionTrade; } });
Object.defineProperty(exports, "GrantedTrade", { enumerable: true, get: function () { return models_1.GrantedTrade; } });
Object.defineProperty(exports, "MonthlyPayStatusItem", { enumerable: true, get: function () { return models_1.MonthlyPayStatusItem; } });
Object.defineProperty(exports, "PayStatusHistory", { enumerable: true, get: function () { return models_1.PayStatusHistory; } });
Object.defineProperty(exports, "Tradeline", { enumerable: true, get: function () { return models_1.Tradeline; } });
Object.defineProperty(exports, "WatchTrade", { enumerable: true, get: function () { return models_1.WatchTrade; } });
Object.defineProperty(exports, "AccountHistorySummary", { enumerable: true, get: function () { return models_1.AccountHistorySummary; } });
Object.defineProperty(exports, "AccountHistorySummaryInfo", { enumerable: true, get: function () { return models_1.AccountHistorySummaryInfo; } });
Object.defineProperty(exports, "InquirySummary", { enumerable: true, get: function () { return models_1.InquirySummary; } });
Object.defineProperty(exports, "InquirySummaryInfo", { enumerable: true, get: function () { return models_1.InquirySummaryInfo; } });
Object.defineProperty(exports, "PortfolioCreditSummary", { enumerable: true, get: function () { return models_1.PortfolioCreditSummary; } });
Object.defineProperty(exports, "PortfolioCreditSummaryInfo", { enumerable: true, get: function () { return models_1.PortfolioCreditSummaryInfo; } });
Object.defineProperty(exports, "PublicRecordSummary", { enumerable: true, get: function () { return models_1.PublicRecordSummary; } });
Object.defineProperty(exports, "PublicRecordSummaryInfo", { enumerable: true, get: function () { return models_1.PublicRecordSummaryInfo; } });
Object.defineProperty(exports, "TradelineSummary", { enumerable: true, get: function () { return models_1.TradelineSummary; } });
Object.defineProperty(exports, "TradelineSummaryInfo", { enumerable: true, get: function () { return models_1.TradelineSummaryInfo; } });
Object.defineProperty(exports, "Bankruptcy", { enumerable: true, get: function () { return models_1.Bankruptcy; } });
Object.defineProperty(exports, "FinancialCounseling", { enumerable: true, get: function () { return models_1.FinancialCounseling; } });
Object.defineProperty(exports, "FinancingStatement", { enumerable: true, get: function () { return models_1.FinancingStatement; } });
Object.defineProperty(exports, "Foreclosure", { enumerable: true, get: function () { return models_1.Foreclosure; } });
Object.defineProperty(exports, "Garnishment", { enumerable: true, get: function () { return models_1.Garnishment; } });
Object.defineProperty(exports, "LegalItem", { enumerable: true, get: function () { return models_1.LegalItem; } });
Object.defineProperty(exports, "MaritalItem", { enumerable: true, get: function () { return models_1.MaritalItem; } });
Object.defineProperty(exports, "MiscPublicRecord", { enumerable: true, get: function () { return models_1.MiscPublicRecord; } });
Object.defineProperty(exports, "PublicRecord", { enumerable: true, get: function () { return models_1.PublicRecord; } });
Object.defineProperty(exports, "RegisteredItem", { enumerable: true, get: function () { return models_1.RegisteredItem; } });
Object.defineProperty(exports, "TaxLien", { enumerable: true, get: function () { return models_1.TaxLien; } });
Object.defineProperty(exports, "Inquiry", { enumerable: true, get: function () { return models_1.Inquiry; } });
Object.defineProperty(exports, "BorrowerAddress", { enumerable: true, get: function () { return models_1.BorrowerAddress; } });
Object.defineProperty(exports, "BorrowerBirth", { enumerable: true, get: function () { return models_1.BorrowerBirth; } });
Object.defineProperty(exports, "BorrowerBureauIdentifier", { enumerable: true, get: function () { return models_1.BorrowerBureauIdentifier; } });
Object.defineProperty(exports, "BorrowerName", { enumerable: true, get: function () { return models_1.BorrowerName; } });
Object.defineProperty(exports, "BorrowerTelephone", { enumerable: true, get: function () { return models_1.BorrowerTelephone; } });
Object.defineProperty(exports, "CreditScoreFactor", { enumerable: true, get: function () { return models_1.CreditScoreFactor; } });
Object.defineProperty(exports, "CreditScore", { enumerable: true, get: function () { return models_1.CreditScore; } });
Object.defineProperty(exports, "CreditStatement", { enumerable: true, get: function () { return models_1.CreditStatement; } });
Object.defineProperty(exports, "Employer", { enumerable: true, get: function () { return models_1.Employer; } });
Object.defineProperty(exports, "TUName", { enumerable: true, get: function () { return models_1.TUName; } });
Object.defineProperty(exports, "PhoneNumber", { enumerable: true, get: function () { return models_1.PhoneNumber; } });
Object.defineProperty(exports, "SocialPartition", { enumerable: true, get: function () { return models_1.SocialPartition; } });
Object.defineProperty(exports, "Social", { enumerable: true, get: function () { return models_1.Social; } });
Object.defineProperty(exports, "BankingRecord", { enumerable: true, get: function () { return models_1.BankingRecord; } });
Object.defineProperty(exports, "CodeRef", { enumerable: true, get: function () { return models_1.CodeRef; } });
Object.defineProperty(exports, "CreditAddress", { enumerable: true, get: function () { return models_1.CreditAddress; } });
Object.defineProperty(exports, "Remark", { enumerable: true, get: function () { return models_1.Remark; } });
Object.defineProperty(exports, "SourceSummary", { enumerable: true, get: function () { return models_1.SourceSummary; } });
Object.defineProperty(exports, "Source", { enumerable: true, get: function () { return models_1.Source; } });
Object.defineProperty(exports, "TUDate", { enumerable: true, get: function () { return models_1.TUDate; } });
Object.defineProperty(exports, "Ad", { enumerable: true, get: function () { return models_1.Ad; } });
Object.defineProperty(exports, "Analytic", { enumerable: true, get: function () { return models_1.Analytic; } });
Object.defineProperty(exports, "AnalyticMaker", { enumerable: true, get: function () { return models_1.AnalyticMaker; } });
Object.defineProperty(exports, "APIErrorLog", { enumerable: true, get: function () { return models_1.APIErrorLog; } });
Object.defineProperty(exports, "APITransactionLog", { enumerable: true, get: function () { return models_1.APITransactionLog; } });
Object.defineProperty(exports, "Campaign", { enumerable: true, get: function () { return models_1.Campaign; } });
Object.defineProperty(exports, "CampaignMaker", { enumerable: true, get: function () { return models_1.CampaignMaker; } });
Object.defineProperty(exports, "CreditReport", { enumerable: true, get: function () { return models_1.CreditReport; } });
Object.defineProperty(exports, "CreditReportMaker", { enumerable: true, get: function () { return models_1.CreditReportMaker; } });
Object.defineProperty(exports, "CreditDataBreachesMetric", { enumerable: true, get: function () { return models_1.CreditDataBreachesMetric; } });
Object.defineProperty(exports, "CreditForbearanceMetric", { enumerable: true, get: function () { return models_1.CreditForbearanceMetric; } });
Object.defineProperty(exports, "CreditMixMetric", { enumerable: true, get: function () { return models_1.CreditMixMetric; } });
Object.defineProperty(exports, "CreditNegativeAccountsMetric", { enumerable: true, get: function () { return models_1.CreditNegativeAccountsMetric; } });
Object.defineProperty(exports, "CreditUtilizationMetric", { enumerable: true, get: function () { return models_1.CreditUtilizationMetric; } });
Object.defineProperty(exports, "CreditReportMetrics", { enumerable: true, get: function () { return models_1.CreditReportMetrics; } });
Object.defineProperty(exports, "CreditReportMetric", { enumerable: true, get: function () { return models_1.CreditReportMetric; } });
Object.defineProperty(exports, "InvestigationResult", { enumerable: true, get: function () { return models_1.InvestigationResult; } });
Object.defineProperty(exports, "OpsReport", { enumerable: true, get: function () { return models_1.OpsReport; } });
Object.defineProperty(exports, "OpsReportMaker", { enumerable: true, get: function () { return models_1.OpsReportMaker; } });
Object.defineProperty(exports, "Referral", { enumerable: true, get: function () { return models_1.Referral; } });
Object.defineProperty(exports, "ReferralMaker", { enumerable: true, get: function () { return models_1.ReferralMaker; } });
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return models_1.Session; } });
Object.defineProperty(exports, "SessionMaker", { enumerable: true, get: function () { return models_1.SessionMaker; } });
Object.defineProperty(exports, "UserInitiative", { enumerable: true, get: function () { return models_1.UserInitiative; } });
Object.defineProperty(exports, "Initiative", { enumerable: true, get: function () { return models_1.Initiative; } });
Object.defineProperty(exports, "Program", { enumerable: true, get: function () { return models_1.Program; } });
Object.defineProperty(exports, "TransunionUtil", { enumerable: true, get: function () { return models_1.TransunionUtil; } });
/*======================*/
/*        types         */
/*======================*/
var types_1 = require("./types");
Object.defineProperty(exports, "ModelAttributeTypes", { enumerable: true, get: function () { return types_1.ModelAttributeTypes; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "Homogenize", { enumerable: true, get: function () { return utils_1.Homogenize; } });
Object.defineProperty(exports, "Nested", { enumerable: true, get: function () { return utils_1.Nested; } });
Object.defineProperty(exports, "AdsQueries", { enumerable: true, get: function () { return utils_1.AdsQueries; } });
Object.defineProperty(exports, "AnalyticQueries", { enumerable: true, get: function () { return utils_1.AnalyticQueries; } });
Object.defineProperty(exports, "APIErrorLogQueries", { enumerable: true, get: function () { return utils_1.APIErrorLogQueries; } });
Object.defineProperty(exports, "APITransactionLogQueries", { enumerable: true, get: function () { return utils_1.APITransactionLogQueries; } });
Object.defineProperty(exports, "CampaignQueries", { enumerable: true, get: function () { return utils_1.CampaignQueries; } });
Object.defineProperty(exports, "CreditReportQueries", { enumerable: true, get: function () { return utils_1.CreditReportQueries; } });
Object.defineProperty(exports, "CreditScoreQueries", { enumerable: true, get: function () { return utils_1.CreditScoreQueries; } });
Object.defineProperty(exports, "InvestigationResultQueries", { enumerable: true, get: function () { return utils_1.InvestigationResultQueries; } });
Object.defineProperty(exports, "OpsReportQueries", { enumerable: true, get: function () { return utils_1.OpsReportQueries; } });
Object.defineProperty(exports, "ReferralQueries", { enumerable: true, get: function () { return utils_1.ReferralQueries; } });
Object.defineProperty(exports, "SessionQueries", { enumerable: true, get: function () { return utils_1.SessionQueries; } });
Object.defineProperty(exports, "UserInitiativeQueries", { enumerable: true, get: function () { return utils_1.UserInitiativeQueries; } });