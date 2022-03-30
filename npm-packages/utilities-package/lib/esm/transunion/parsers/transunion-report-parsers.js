import { NAME_MAP, ADDRESS_LINE_1, ADDRESS_LINE_2 } from '../constants';
import { TransunionMissing } from '../transunion-missing';
export class TransunionReportParsers extends TransunionMissing {
    constructor() {
        super();
    }
    /**
     * Flatten the remarks into one paragraph
     * @param remarks
     * @returns
     */
    static parseRemarks(remarks) {
        var _a;
        if (remarks === undefined)
            return '';
        return remarks instanceof Array
            ? remarks
                .map((r) => { var _a; return ((_a = r.RemarkCode) === null || _a === void 0 ? void 0 : _a.description) || ''; })
                .reduce((a, b) => {
                return `${a} \n ${b}`;
            }, '')
            : ((_a = remarks.RemarkCode) === null || _a === void 0 ? void 0 : _a.description) || '';
    }
    /**
     * Flatten the credit statement provided by the borrower
     */
    static parseBorrowerForCreditStatement(borrower) {
        if (!borrower)
            return;
        return borrower instanceof Array
            ? this.parseCreditStatement(borrower[0].CreditStatement)
            : this.parseCreditStatement(borrower.CreditStatement);
    }
    /**
     * Flatten the credit statement provided by the borrower
     */
    static parseCreditStatement(creditStatement) {
        var _a;
        if (!creditStatement)
            return;
        return (_a = creditStatement[0]) === null || _a === void 0 ? void 0 : _a.statement;
    }
    /**
     * Reconstitutes the borrower name into one string
     * @param borrowerName
     * @returns
     */
    static unparseName(borrowerName) {
        if (!borrowerName)
            return this.bcMissing;
        if (!borrowerName.Name)
            return this.bcMissing;
        const name = borrowerName.Name;
        if (!name)
            return this.bcMissing;
        let fullName = '';
        for (const key in NAME_MAP) {
            const str = !!name[key] ? `${name[key]} ` : '';
            fullName = `${fullName}${str}`;
        }
        return fullName;
    }
    /**
     * Reconstitutes the borrower employers with address into one string with line break
     * @param employer
     * @returns
     */
    static unparseEmployer(employer) {
        if (!employer)
            return this.bcMissing;
        if (!employer.name)
            return this.bcMissing;
        let empAddress = employer.CreditAddress ? `\n${this.unparseAddress(employer.CreditAddress)}` : '';
        empAddress = empAddress.trim() === ',' ? '' : empAddress;
        let str = `${employer.name}${empAddress}`;
        return str;
    }
    /**
     * Reconstitutes the borrower phone number into one string with area code and extension
     * @param phone
     * @returns
     */
    static unparsePhone(phone) {
        if (!phone)
            return this.bcMissing;
        let area = phone.AreaCode ? `${phone.AreaCode}` : '000';
        let main = phone.Number ? `${phone.Number}` : '';
        const digits = `${area}${main}`.replace(/[^0-9]/g, '');
        if (!digits)
            return '';
        return digits;
    }
    /**
     * Reconstitutes the merge report subscriber name, address, and phone
     * @param subscriber
     * @returns
     */
    static unparseSubscriber(subscriber, nameOverride) {
        if (!subscriber)
            return [0, 0, 0].map((x) => this.bcMissing);
        const name = nameOverride ? nameOverride : subscriber.name;
        const address = this.unparseAddress(subscriber.CreditAddress);
        const phone = subscriber.telephone;
        const filtered = [name, address, phone].filter((x) => x && x.length > 0);
        return filtered;
    }
    /**
     * Reconstitutes the borrower address into one string with line break
     * @param address
     * @returns
     */
    static unparseAddress(address) {
        if (!address)
            return '';
        let records = address;
        let creditAddress = '';
        for (const key in ADDRESS_LINE_1) {
            const str = !!records[key] ? `${records[key]} ` : '';
            creditAddress = `${creditAddress}${str}`;
        }
        creditAddress = `${creditAddress.trim()} \n`;
        for (const key in ADDRESS_LINE_2) {
            let comma = key !== 'postalCode' ? ', ' : '';
            const str = !!records[key] ? `${records[key]}${comma}` : '';
            creditAddress = `${creditAddress}${str}`;
        }
        return creditAddress;
    }
}
