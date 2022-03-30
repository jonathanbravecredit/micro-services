import { ITUUnparsed, ITUText } from './common-tu.interface';
export interface IDisputeCreditBureau {
    creditBureau: ICreditBureau;
}
export interface ICreditBureau {
    version: number | string;
    transactionControl: ITransactionControl;
    productArray: IProductArray | IProductArray[];
}
export interface ITransactionControl {
    tracking: ITracking;
}
export interface ITracking {
    transactionTimeStamp: string;
    language: string;
    identifier: IIdentifier;
    responseCode: number;
    responseMessage: string;
}
export interface IProductArray {
    product: IProduct;
}
export interface IIdentifier {
    fin: string;
    activityNumber: number | string;
    partyId: number | string;
}
export interface IProduct {
    code: number;
    subject: ISubject;
}
export interface ISubject {
    fileAccessCode: string;
    enclosures: IEnclosures;
    subjectRecord: ISubjectRecord;
    fullDisclFlag: string;
}
export interface IEnclosures {
    codes: ICodes | ICodes[];
    addresseeContact: IContact;
    returnMailContact: IContact;
}
export interface ICodes {
    code: string | number;
    type: string | number;
    versionNo: string | number;
}
export interface IContact {
    name: ITUUnparsed;
    address: IAddress;
}
export interface IAddress {
    street: IStreet;
    location: ILocation;
    dateReported?: string;
    order?: string | number;
}
export interface IStreet extends ITUUnparsed {
    number: number | string;
    name: string;
}
export interface ILocation extends ITUUnparsed {
    city?: string;
    state?: string;
    zipCode?: number | string;
    zipExt?: number | string;
}
export interface ISubjectRecord {
    fileSummary: IFileSummary;
    indicative: IIndicative;
    custom: ICustom;
    addOnProduct: IAddOnProduct;
    closingInfo: IClosingInfo;
    fileNumber: number | string;
    consumerID: number | string;
    fileDate: string;
    dynamicText: IDynamicText;
}
export interface IFileSummary {
    inFileSinceDate: string;
    disclosureCoverInfo: IDisclosureCoverInfo;
}
export interface IDisclosureCoverInfo {
    coverCode: number | string;
    versionNo: number | string;
    disputeURL: string;
    summarySection: ISummarySection;
    resellterOperatorId: string;
}
export interface ISummarySection {
    lineItem: ILineItem | ILineItem[];
}
export interface ILineItem {
    handle: string;
    itemKey: string;
    itemType: number | string;
    credit: ICredit;
}
export interface ICredit {
    item: IItem;
    description: IDescription;
    result: string;
    reason?: string;
}
export interface IItem {
    itemName?: string;
    subscriber: ICreditBureauSubscriber;
}
export interface ICreditBureauSubscriber {
    industryCode?: string;
    memberCode?: string;
    name: ITUUnparsed;
    address: IAddress;
    phone: IPhone;
}
export interface IPhone extends ITUUnparsed {
    number: IPhoneNumber;
}
export interface IPhoneNumber extends ITUUnparsed {
    areaCode: number | string;
    exchange: number | string;
    suffix: number | string;
}
export interface IDescription {
    descriptionText: string;
}
export interface IIndicative {
    name: IName;
    address: IAddress;
    socialSecurity: ISocialSecurity;
}
export interface IName {
    person: IPerson;
}
export interface IPerson extends ITUUnparsed {
    first?: string;
    middle?: string;
    last?: string;
    order?: number | string;
}
export interface ISocialSecurity {
    number: string;
    order: number | string;
}
export interface ICustom {
    credit: ICustomCredit;
}
export interface ICustomCredit {
    trade: ITrade | ITrade[];
    publicRecord: IPublicRecord | IPublicRecord[];
    histRemarkLegend: unknown;
}
export interface IRecordBase {
    itemKey: string;
    type?: string;
    subscriber: ICreditBureauSubscriber;
    dateEffective: string;
    dateEffectiveLabel: string;
}
export interface ITrade extends IRecordBase {
    portfolioType: string;
    accountNumber: string;
    dateOpened: string;
    dateClosed?: string;
    datePaidOut?: string;
    currentBalance?: number | string;
    highCredit: number | string;
    creditLimit?: number | string;
    accountRating: string;
    remark?: ICBRemark;
    terms: ITerms;
    account?: IAccount;
    paymentHistory?: IPaymentHistory;
    mostRecentPayment: IMostRecentPayments;
    additionalTradeAccount: IAdditionalTradeAccount;
    suppressionFlag: boolean;
    adverseFlag: boolean;
    estimatedDeletionDate: string;
    accountRatingDescription: string;
    portfolioTypeDescription: string;
    ECOADesignator: string;
    ECOADesignatorDescription: string;
    histPaymentDueList: unknown;
    histPaymentAmtList: unknown;
    histBalanceList: unknown;
    histPastDueList: unknown;
    histRemarkList?: unknown;
    isCollection: boolean;
}
export interface ICBRemark {
    code?: string;
    type?: string;
    description?: string;
}
export interface ITerms {
    description: string;
}
export interface IAccount extends ICBRemark {
}
export interface IPaymentHistory {
    paymentPattern: IPaymentPattern;
    historicalCounters: IHistoricalCounters;
}
export interface IPaymentPattern {
    startDate: string;
    text: string;
}
export interface IHistoricalCounters {
    monthsReviewedCount: number | string;
    late30DaysTotal: number | string;
    late60DaysTotal: number | string;
    late90DaysTotal: number | string;
}
export interface IMostRecentPayments {
    date?: string;
    description: string;
}
export interface IAdditionalTradeAccount {
    original: string;
}
export interface IPublicRecord extends IRecordBase {
    docketNumber: string;
    attorney: string;
    plaintiff: unknown;
    dateFiled: string;
    datePaid: string;
    ECOADesignator: string;
    ECOADescription: string;
    source: ICBRemark;
    estimatedDateOfDeletion: string;
    suppressionIndicator: boolean;
    publicRecordTypeDescription: string;
    order: number | string;
    originalBalance?: number | string;
}
export interface IAddOnProduct {
    scoreModel: IScoreModel;
    militaryLendingActSearch: IMilitaryLendingActSearch;
}
export interface IScoreModel {
    score: IScore;
}
export interface IScore {
    name: IName;
    productCode: string;
    score: number | string;
    scoreGrade: string;
    scoreDate: string;
    quantitativeGraphNumber: number | string;
    populationGraphNumber: number | string;
    populationDescription: string;
    summaryDescription: string;
}
export interface IMilitaryLendingActSearch {
    searchStatus: string;
}
export interface IClosingInfo {
    mail: ITUUnparsed;
    address: IAddress;
    phone: IPhone;
    contactURL: string;
    disputeURL: string;
}
export interface IDynamicText {
    personalInfoDetail: ITUText;
    publicRecordDetail: ITUText | ITUText[];
    adverseAcctDetail: ITUText | ITUText[];
    accountDetail: ITUText | ITUText[];
}
