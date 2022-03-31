import { IBreachCard } from '../_types/breach-card';
export declare enum CreditBureauFindingsType {
    Trade = "tradeline",
    PublicRecord = "publicrecord",
    PersonalInfo = "personalinfo"
}
export declare enum TUStatusRefStatuses {
    Success = "success",
    Failed = "failed",
    Bypassed = "bypassed"
}
export declare enum TUBundles {
    IndicativeEnrichment = "IndicativeEnrichment",
    GetAuthenticationQuestions = "GetAuthenticationQuestions",
    VerifyAuthenticationQuestionsOTP = "VerifyAuthenticationQuestionsOTP",
    VerifyAuthenticationQuestionsKBA = "VerifyAuthenticationQuestionsKBA"
}
export declare enum CreditReportGroups {
    CreditCards = "creditCards",
    CollectionsAccounts = "collectionsAccounts",
    InstallmentLoans = "installmentLoans",
    Mortgages = "mortgages"
}
export declare enum OTPQuestion {
    FullText = "Please select your preferred method of Authentication?(Standard text message and voice rates apply)*</FullQuestionText",
    PartialOne = "preferred method of Authentication",
    PartialTwo = "Standard text message and voice rates apply"
}
export declare enum OTPReponse {
    FullText = "Deliver passcode via Text Message",
    PartialOne = "via Text Message"
}
export declare enum PassCodeQuestion {
    FullText = "Enter the passcode you received",
    PartialOne = "passcode"
}
export declare enum ReportPartitions {
    TradelineItem = "tradelineitem",
    PersonalItem = "personalitem",
    PublicItem = "publicitem"
}
export declare enum DataBreaches {
    None = "none",
    Condition1 = "california-dmv",
    Condition2 = "university-california",
    Condition3 = "university-colorado",
    Condition4 = "kroger-customer",
    Condition5 = "tmobile-customer",
    Condition6 = "state-washington",
    Condition7 = "experian"
}
export declare const PHONE_MAP: Record<string, any>;
export declare const NAME_MAP: Record<string, any>;
export declare const ADDRESS_LINE_1: Record<string, any>;
export declare const ADDRESS_LINE_2: Record<string, any>;
export declare const CREDIT_REPORT_GROUPS: Record<string, any>;
export declare const ONTIME_PAY_STATUS_CODES: Record<string, any>;
export declare const UNKNOWN_PAY_STATUS_CODES: Record<string, any>;
export declare const TOO_NEW_STATUS_CODE: Record<string, any>;
export declare const LATE_30_STATUS_CODE: Record<string, any>;
export declare const LATE_60_STATUS_CODE: Record<string, any>;
export declare const LATE_90_STATUS_CODE: Record<string, any>;
export declare const LATE_120_STATUS_CODE: Record<string, any>;
export declare const COLLECTION_PAY_STATUS_CODES: Record<string, any>;
export declare const WAGE_EARNER_PAY_STATUS_CODES: Record<string, any>;
export declare const REPOSSESSION_PAY_STATUS_CODE: Record<string, any>;
export declare const LATE_PAY_STATUS_CODES: Record<string, any>;
export declare const POSITIVE_PAY_STATUS_CODES: Record<string, string>;
export declare const NEGATIVE_PAY_STATUS_CODES: Record<string, string>;
export declare const PAY_STATUS_CODES: Record<string, any>;
export declare const PAY_STATUS_WARNINGS: Record<string, string>;
export declare const BRAVE_ACCOUNT_TYPE: Record<string, any>;
export declare const DATA_BREACH_CARDS: Record<any, IBreachCard>;
export declare const FORBEARANCE_TYPE: Record<any, boolean>;
export declare const INDUSTRY_CODES: Record<string, string>;
export declare const KROGER_STATES: Record<any, boolean>;
export declare const EXPERIAN_STATES: Record<any, boolean>;
export declare const INVESTIGATION_RESULTS_CODE_MAPPING: {
    type: string;
    title: string;
}[];
export declare const TRANSUNION_CRITICAL_ERRORS: Record<string, {
    keyWords: [string];
}>;
export declare const TRANSUNION_ERROR_CODES: Record<string, any>;
