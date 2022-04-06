import { ICreditBureauSubscriber } from '../../../types/credit-bureau';
import { TransunionMissing } from '../transunion-missing';

export class TransunionDisputeParsers extends TransunionMissing {
  constructor() {
    super();
  }

  /**
   * Reconstitutes the investigation results public record, subscriber name, address, and phone
   * - this is typically the court house name, location, and phone for bankruptcy
   * - [name, address, phone]
   * @param subscriber
   * @returns
   */
  static unparseSubscriber(subscriber: ICreditBureauSubscriber | undefined): [string, string, string] {
    if (!subscriber) return [0, 0, 0].map((x) => this.bcMissing) as [string, string, string];
    const name = subscriber?.name?.unparsed || this.bcMissing;
    const address = subscriber?.address?.street?.unparsed
      ? `${subscriber?.address?.street?.unparsed}\n${subscriber?.address?.location?.unparsed}`
      : subscriber?.address?.location?.unparsed || this.bcMissing;
    const phone = subscriber?.phone?.number?.unparsed || subscriber?.phone?.unparsed || this.bcMissing;
    return [name, address, phone];
  }
}
