import { ICreditBureauSubscriber } from '../../../types/credit-bureau';
import { TransunionMissing } from '../transunion-missing';
export declare class TransunionDisputeParsers extends TransunionMissing {
    constructor();
    /**
     * Reconstitutes the investigation results public record, subscriber name, address, and phone
     * - this is typically the court house name, location, and phone for bankruptcy
     * - [name, address, phone]
     * @param subscriber
     * @returns
     */
    static unparseSubscriber(subscriber: ICreditBureauSubscriber | undefined): [string, string, string];
}
