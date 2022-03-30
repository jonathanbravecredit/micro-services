import { TransunionBase } from '@shared/utils/transunion/transunion-base';
import { TransunionParsers } from '@shared/utils/transunion/parsers/transunion-parsers';
import { TransunionQueries } from '@shared/utils/transunion/queries/transunion-queries';
import { CREDIT_REPORT_GROUPS, CreditReportGroups } from '@shared/constants/credit-report';
import { PAY_STATUS_WARNINGS, POSITIVE_PAY_STATUS_CODES } from '@shared/constants/pay-status-codes';
export const TUStatusMapping = {
    opendispute: 'processing',
    completedispute: 'decision',
    cancelleddispute: 'cancelled',
    pendingdispute: 'pending',
};
export class TransunionMappers extends TransunionBase {
    constructor() {
        super();
    }
    static mapBorrowerToDetails(borrower) {
        let names = borrower.BorrowerName instanceof Array
            ? borrower.BorrowerName
            : borrower.BorrowerName
                ? [borrower.BorrowerName]
                : [];
        let employers = borrower.Employer instanceof Array ? borrower.Employer : borrower.Employer ? [borrower.Employer] : [];
        let prevAddress = borrower.PreviousAddress instanceof Array
            ? borrower.PreviousAddress
            : borrower.PreviousAddress
                ? [borrower.PreviousAddress]
                : [];
        let currAddress = borrower.BorrowerAddress instanceof Array ? borrower.BorrowerAddress[0] : borrower.BorrowerAddress;
        let phones = borrower.BorrowerTelephone instanceof Array
            ? borrower.BorrowerTelephone
            : borrower.BorrowerTelephone
                ? [borrower.BorrowerTelephone]
                : [];
        const unNames = names.map((name) => this.parser.report.unparseName(name));
        const unAddress = this.parser.report.unparseAddress(currAddress === null || currAddress === void 0 ? void 0 : currAddress.CreditAddress);
        const unPrevAddress = prevAddress.map((addr) => this.parser.report.unparseAddress(addr === null || addr === void 0 ? void 0 : addr.CreditAddress));
        const unPhones = phones.map((phone) => this.parser.report.unparsePhone(phone === null || phone === void 0 ? void 0 : phone.PhoneNumber));
        const unEmployers = employers.map((emp) => this.parser.report.unparseEmployer(emp));
        const results = {
            personalItem: borrower,
            ssn: `${borrower.SocialSecurityNumber}`,
            currentAddress: unAddress,
            borrowerNamesArray: unNames || [],
            previousAddressesArray: unPrevAddress || [],
            telephonesArray: unPhones || [],
            employersArray: unEmployers || [],
            borrowersNamesRaw: names || [],
            currentAddressRaw: currAddress || {},
            previousAddressesRaw: prevAddress || [],
            employersRaw: employers || [],
            telephonesRaw: phones || [],
        };
        return results;
    }
    static mapPublicItemToDispute(item) {
        var _a, _b, _c;
        const publicRecord = item.PublicRecord instanceof Array ? item.PublicRecord[0] : item.PublicRecord; // schema says array but should not be;
        return {
            publicPartition: item,
            docketNumber: (publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.referenceNumber) || this.bcMissing,
            courtName: (publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.courtName) || this.bcMissing,
            courtLocation: ((_b = (_a = publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.LegalItem) === null || _a === void 0 ? void 0 : _a.CourtLocation) === null || _b === void 0 ? void 0 : _b.description) || this.bcMissing,
            dateFiled: (publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.dateFiled) || this.bcMissing,
            dateUpdated: (publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.dateUpdated) || this.bcMissing,
            publicItemType: ((_c = publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.Type) === null || _c === void 0 ? void 0 : _c.description) || this.bcMissing,
            expirationDate: (publicRecord === null || publicRecord === void 0 ? void 0 : publicRecord.ExpirationDate) || this.bcMissing,
        };
    }
    /**
     * Map the tradeline object to the negative account object
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static mapTradelineToSummaryCard(tradeLines) {
        return tradeLines.map((item) => {
            const firstField = this.getFirstFields(item);
            const secondField = this.getSecondFields(item);
            const { accountTypeSymbol, Tradeline: { creditorName, OpenClosed, PayStatus } = {} } = item;
            const status = PAY_STATUS_WARNINGS[`${PayStatus === null || PayStatus === void 0 ? void 0 : PayStatus.symbol}`] || 'brave-unknown';
            return {
                type: accountTypeSymbol,
                creditorName: creditorName,
                isOpen: `${OpenClosed === null || OpenClosed === void 0 ? void 0 : OpenClosed.symbol}`.toLowerCase() !== 'c',
                firstFieldName: firstField.firstFieldName,
                firstFieldValue: firstField.firstFieldValue,
                firstFieldType: firstField.firstFieldType,
                secondFieldName: secondField.secondFieldName,
                secondFieldValue: secondField.secondFieldValue,
                secondFieldType: secondField.secondFieldType,
                thirdFieldName: 'Payment Status',
                thirdFieldValue: PayStatus === null || PayStatus === void 0 ? void 0 : PayStatus.description,
                status: status,
                positive: POSITIVE_PAY_STATUS_CODES[`${PayStatus === null || PayStatus === void 0 ? void 0 : PayStatus.symbol}`] || false,
                tradeline: item,
            };
        });
    }
    /**
     * Helper function to get the label and value for the first fields
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getFirstFields(partition) {
        var _a, _b, _c, _d;
        const sym = (_a = partition === null || partition === void 0 ? void 0 : partition.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!sym)
            return { firstFieldName: 'Unknown', firstFieldValue: 'Unknown', firstFieldType: 'string' };
        const group = CREDIT_REPORT_GROUPS[sym]['group'];
        switch (group) {
            case CreditReportGroups.CreditCards:
            case CreditReportGroups.InstallmentLoans:
            case CreditReportGroups.Mortgages:
                return {
                    firstFieldName: 'Current Balance',
                    firstFieldValue: ((_b = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _b === void 0 ? void 0 : _b.currentBalance) || 0,
                    firstFieldType: 'currency',
                };
            case CreditReportGroups.CollectionsAccounts:
                return {
                    firstFieldName: 'Original Creditor',
                    firstFieldValue: ((_d = (_c = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _c === void 0 ? void 0 : _c.CollectionTrade) === null || _d === void 0 ? void 0 : _d.originalCreditor) || '',
                    firstFieldType: 'string',
                };
            default:
                return { firstFieldName: 'Unknown', firstFieldValue: 'Unknown', firstFieldType: 'string' };
        }
    }
    /**
     * Helper function to get the label and value for the second fields
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getSecondFields(partition) {
        var _a, _b, _c, _d, _e, _f, _g;
        const sym = (_a = partition === null || partition === void 0 ? void 0 : partition.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!sym)
            return { secondFieldName: 'Unknown', secondFieldValue: 'Unknown', secondFieldType: 'string' };
        const group = CREDIT_REPORT_GROUPS[sym]['group'];
        switch (group) {
            case CreditReportGroups.CreditCards:
                return {
                    secondFieldName: 'Credit Limit',
                    secondFieldValue: ((_c = (_b = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _b === void 0 ? void 0 : _b.GrantedTrade) === null || _c === void 0 ? void 0 : _c.CreditLimit) || 0,
                    secondFieldType: 'currency',
                };
            case CreditReportGroups.CollectionsAccounts:
                return {
                    secondFieldName: 'Original Creditor',
                    secondFieldValue: ((_e = (_d = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _d === void 0 ? void 0 : _d.CollectionTrade) === null || _e === void 0 ? void 0 : _e.originalCreditor) || '',
                    secondFieldType: 'string',
                };
            case CreditReportGroups.InstallmentLoans:
                return {
                    secondFieldName: 'Original Loan Amount',
                    secondFieldValue: ((_f = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _f === void 0 ? void 0 : _f.highBalance) || '',
                    secondFieldType: 'currency',
                };
            case CreditReportGroups.Mortgages:
                return {
                    secondFieldName: 'Loan Amount',
                    secondFieldValue: ((_g = partition === null || partition === void 0 ? void 0 : partition.Tradeline) === null || _g === void 0 ? void 0 : _g.highBalance) || '',
                    secondFieldType: 'currency',
                };
            default:
                return { secondFieldName: 'Unknown', secondFieldValue: 'Unknown', secondFieldType: 'string' };
        }
    }
    static mapTradelineDispute(item, dispute) {
        var _a, _b, _c, _d, _e, _f;
        return {
            dispute: dispute,
            creditorName: ((_b = (_a = item === null || item === void 0 ? void 0 : item.tradeline) === null || _a === void 0 ? void 0 : _a.Tradeline) === null || _b === void 0 ? void 0 : _b.creditorName) || '--',
            status: (dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) ? TUStatusMapping[`${(_c = dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) === null || _c === void 0 ? void 0 : _c.toLowerCase()}`] || '--' : '--',
            accountType: ((_d = item === null || item === void 0 ? void 0 : item.tradeline) === null || _d === void 0 ? void 0 : _d.accountTypeDescription) || '--',
            dateSubmitted: (dispute === null || dispute === void 0 ? void 0 : dispute.openedOn) || '--',
            estCompletionDate: ((_e = dispute === null || dispute === void 0 ? void 0 : dispute.openDisputes) === null || _e === void 0 ? void 0 : _e.estimatedCompletionDate) || ((_f = dispute === null || dispute === void 0 ? void 0 : dispute.closedDisputes) === null || _f === void 0 ? void 0 : _f.estimatedCompletionDate) || '--',
        };
    }
    static mapHistoricalTradelineDispute(item, dispute) {
        var _a, _b;
        return {
            dispute: dispute,
            creditorName: ((_b = (_a = item === null || item === void 0 ? void 0 : item.tradeline) === null || _a === void 0 ? void 0 : _a.Tradeline) === null || _b === void 0 ? void 0 : _b.creditorName) || '--',
            resultReceived: (dispute === null || dispute === void 0 ? void 0 : dispute.closedOn) || '--', // TODO need to get this from the actual results
        };
    }
    static mapPersonalDispute(item, dispute) {
        var _a, _b, _c, _d, _e;
        return {
            dispute: dispute,
            creditorName: ((_a = item === null || item === void 0 ? void 0 : item.personalItem) === null || _a === void 0 ? void 0 : _a.key) || '--',
            status: (dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) ? TUStatusMapping[`${(_b = dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) === null || _b === void 0 ? void 0 : _b.toLowerCase()}`] || '--' : '--',
            accountType: ((_c = item === null || item === void 0 ? void 0 : item.personalItem) === null || _c === void 0 ? void 0 : _c.parsedValue) || '--',
            dateSubmitted: (dispute === null || dispute === void 0 ? void 0 : dispute.openedOn) || '--',
            estCompletionDate: ((_d = dispute === null || dispute === void 0 ? void 0 : dispute.openDisputes) === null || _d === void 0 ? void 0 : _d.estimatedCompletionDate) || ((_e = dispute === null || dispute === void 0 ? void 0 : dispute.closedDisputes) === null || _e === void 0 ? void 0 : _e.estimatedCompletionDate) || '--',
        };
    }
    static mapHistoricalPersonalDispute(item, dispute) {
        var _a;
        return {
            dispute: dispute,
            creditorName: ((_a = item === null || item === void 0 ? void 0 : item.personalItem) === null || _a === void 0 ? void 0 : _a.key) || '--',
            resultReceived: (dispute === null || dispute === void 0 ? void 0 : dispute.closedOn) || '--', // TODO need to get this from the actual results
        };
    }
    static mapPublicDispute(item, dispute) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            dispute: dispute,
            creditorName: ((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.publicItem) === null || _a === void 0 ? void 0 : _a.PublicRecord) === null || _b === void 0 ? void 0 : _b.Classification) === null || _c === void 0 ? void 0 : _c.description) || '--',
            status: (dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) ? TUStatusMapping[`${(_d = dispute === null || dispute === void 0 ? void 0 : dispute.disputeStatus) === null || _d === void 0 ? void 0 : _d.toLowerCase()}`] || '--' : '--',
            accountType: ((_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.publicItem) === null || _e === void 0 ? void 0 : _e.PublicRecord) === null || _f === void 0 ? void 0 : _f.Type) === null || _g === void 0 ? void 0 : _g.description) || '--',
            dateSubmitted: (dispute === null || dispute === void 0 ? void 0 : dispute.openedOn) || '--',
            estCompletionDate: ((_h = dispute === null || dispute === void 0 ? void 0 : dispute.openDisputes) === null || _h === void 0 ? void 0 : _h.estimatedCompletionDate) || ((_j = dispute === null || dispute === void 0 ? void 0 : dispute.closedDisputes) === null || _j === void 0 ? void 0 : _j.estimatedCompletionDate) || '--',
        };
    }
    static mapHistoricalPublicDispute(item, dispute) {
        var _a, _b, _c;
        return {
            dispute: dispute,
            creditorName: ((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.publicItem) === null || _a === void 0 ? void 0 : _a.PublicRecord) === null || _b === void 0 ? void 0 : _b.Classification) === null || _c === void 0 ? void 0 : _c.description) || '--',
            resultReceived: (dispute === null || dispute === void 0 ? void 0 : dispute.closedOn) || '--', // TODO need to get this from the actual results
        };
    }
}
TransunionMappers.parser = TransunionParsers;
TransunionMappers.query = TransunionQueries;
