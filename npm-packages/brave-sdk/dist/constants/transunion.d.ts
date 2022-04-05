import { IBreachCard, ICreditMixTLSummary, IRecommendationText } from '../types';
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
export declare enum AccountTypes {
    LineOfCredit = "Line of credit",
    Installment = "Installment account",
    Mortgage = "Primary or secondary mortgage",
    Open = "Open account",
    Revolving = "Revolving account",
    Unknown = "Unknown",
    Collection = "Collection account"
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
export declare enum CreditBureauFindingsType {
    Trade = "tradeline",
    PublicRecord = "publicrecord",
    PersonalInfo = "personalinfo"
}
export declare enum CreditMixRecommendations {
    Link = "https://learn.self.inc/lpg/click-through/credit-builder-education-credit-card/?affiliate_partner=Bulldog%20Media%20Group&irgwc=1&irclickid=yB12CQ130xyIRHnyqjWYSydRUkG2Ph1p1VLCXg0&utm_source=impact_radius&utm_medium=affiliate&utm_campaign=Bulldog%20Media%20Group&utm_content=Self%20-%20Credit%20Card%20%2B%20Credit%20Builder%20Combo%20Page&media_partner1=&media_partner2=&media_parter3=&ad_name=Self%20-%20Credit%20Card%20%2B%20Credit%20Builder%20Combo%20Page&ad_type=TEXT_LINK&media_partner_id=70161&campaign_id=10159&media_partner_type=mediapartner&click_time_unix=1638237272355&subid1=N4P567_19805&subid2=&subid3=&sharedid=N4P567_19805&ircid=10159",
    TwoToFourLink = "https://www.commissionsoup.com/opts.aspx?t=POIUA7&u=https%3A%2F%2Fwww.milestonegoldcard.com%2Fpre-qualify%3Fmmcid%3DMAAG00213075001%26subid%3DPOIUA7_5851_19805",
    AllClosedLink = "https://www.commissionsoup.com/opts.aspx?t=POIUA7&u=https%3A%2F%2Fwww.milestonegoldcard.com%2Fpre-qualify%3Fmmcid%3DMAAG00213075001%26subid%3DPOIUA7_5851_19805",
    NotTooLate = "It's never too late to start building a diversified credit base to help your score!",
    GoodStart = "You're off to a good start on building a strong credit base!",
    GreatStart = "You're off to a great start on building a strong credit base!",
    GreatBut = "You have a great credit base but there's a few easy things that can make it even better!",
    GoodBut = "You have a good credit base, but keeping some accounts open could help you in the future!",
    Fantastic = "You're doing a fantastic job managing a variety of credit types!",
    GreatJob = "Great job managing a variety of credit types!",
    ExceptionalJob = "You're doing an exceptional job managing your credit mix!",
    SeeProducts = "Click here to learn about a product that helps you build your credit without taking on debt!",
    MakeStronger = "Make your credit stronger by opening up other credit products. Want to do this without taking on debt? Click here to learn how to do this!",
    WiderCreditBase = "Make your credit stronger with a wider credit base. Click here to learn about an entry-level credit card that could help your credit grow!",
    HavingMore = "Having more than credit cards could help you show lenders you can manage a variety of credit types. Click to learn about an easy way to do this while saving for a house or car!",
    ForExample = "Keeping an old credit card open could really help your score! Click to learn about an unsecured credit card that could help.",
    MakeSure = "Make sure to keep making on-time payments and keeping your utilization low on any credit cards!",
    HouseGoal = "If your goal is to buy a house, click here for a way to continue to building a stronger credit base and score while helping you save for a down payment!",
    ToHelp = "To help your score, remember that keeping credit cards you don't use open, even if you don't use it, increases your credit age and mix!",
    MoreVaried = "Having more varied types of credit could help you show lenders you can manage a variety of credit types. Click to learn about an easy way to do this while saving for your goals!",
    ratingPoor = "Poor",
    poorColor = "#F56700",
    ratingFair = "Fair",
    fairColor = "#F59300",
    ratingGood = "Good",
    goodColor = "#BBD904",
    ratingExcellent = "Excellent",
    excellentColor = "#4BD269"
}
export declare enum CreditMixRecommendationsCodes {
    NoClosedAndNoOpen = "no-closed-and-no-open",
    OnlyOneOpen = "only-one-open",
    TwoToFourOpen = "two-to-four-open",
    FivePlusOnlyCC = "five-plus-only-cc",
    AllClosed = "all-closed",
    SevenOrLessNoMortgage = "seven-or-less-no-mortgage",
    SevenOrLess = "seven-or-less",
    EightOrMoreAtLeastOneOfAll = "eight-or-more-at-least-one-of-all",
    EightOrMore = "eight-or-more"
}
export declare const enum MetricIds {
    CreditMix = "credit_mix",
    CreditUtilization = "credit_utilization",
    NegativeAccounts = "negative_accounts",
    Forbearance = "forbearance",
    Databreaches = "databreaches"
}
export declare const enum MetricLabels {
    CreditMix = "Credit Mix",
    CreditUtilization = "Credit Utilization",
    NegativeAccounts = "Negative Accounts",
    Forbearance = "COVID-19 Loan Relief",
    Databreaches = "Data Breach & Leaks Tracker"
}
export declare enum CreditReportGroups {
    CreditCards = "creditCards",
    CollectionsAccounts = "collectionsAccounts",
    InstallmentLoans = "installmentLoans",
    Mortgages = "mortgages"
}
export declare enum TransunionErrorAction {
    Error = "error",
    Unavailable = "unavailable",
    Retry = "retry"
}
export declare const PHONE_MAP: Record<string, any>;
export declare const NAME_MAP: Record<string, any>;
export declare const ADDRESS_LINE_1: Record<string, any>;
export declare const ADDRESS_LINE_2: Record<string, any>;
export declare const ACCOUNT_TYPES: Record<string, any>;
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
export declare const CREDIT_MIX_CONDITIONS: Record<string, (arg: ICreditMixTLSummary) => boolean>;
export declare const CREDIT_MIX_RECOMMENDATION_LOGIC: Record<string, (summary: ICreditMixTLSummary) => boolean>;
export declare const CREDIT_MIX_RECOMMENDATON_VALUES: Record<string, IRecommendationText>;
export declare const FORBEARANCE_TYPE: Record<any, boolean>;
export declare const STUDENT_LOAN_INDUSTRY_CODES: Record<string, string>;
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
