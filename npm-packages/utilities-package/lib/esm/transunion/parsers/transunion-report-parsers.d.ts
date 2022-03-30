import { IRemark } from '../interfaces/common-tu.interface';
import { IBorrower, IBorrowerName, IEmployer, IPhoneNumber, ISubscriber, ICreditAddress } from '../interfaces/merge-report.interface';
import { TransunionMissing } from '../transunion-missing';
export declare class TransunionReportParsers extends TransunionMissing {
    constructor();
    /**
     * Flatten the remarks into one paragraph
     * @param remarks
     * @returns
     */
    static parseRemarks(remarks: IRemark | IRemark[] | undefined): string;
    /**
     * Flatten the credit statement provided by the borrower
     */
    static parseBorrowerForCreditStatement(borrower: IBorrower | undefined): string | null | undefined;
    /**
     * Flatten the credit statement provided by the borrower
     */
    private static parseCreditStatement;
    /**
     * Reconstitutes the borrower name into one string
     * @param borrowerName
     * @returns
     */
    static unparseName(borrowerName: IBorrowerName | undefined): string;
    /**
     * Reconstitutes the borrower employers with address into one string with line break
     * @param employer
     * @returns
     */
    static unparseEmployer(employer: IEmployer | undefined): string;
    /**
     * Reconstitutes the borrower phone number into one string with area code and extension
     * @param phone
     * @returns
     */
    static unparsePhone(phone: IPhoneNumber | undefined): string;
    /**
     * Reconstitutes the merge report subscriber name, address, and phone
     * @param subscriber
     * @returns
     */
    static unparseSubscriber(subscriber: ISubscriber | undefined | null, nameOverride?: string): [string?, string?, string?];
    /**
     * Reconstitutes the borrower address into one string with line break
     * @param address
     * @returns
     */
    static unparseAddress(address: ICreditAddress | undefined): string;
}
