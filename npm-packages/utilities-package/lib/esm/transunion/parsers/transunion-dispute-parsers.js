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
    static unparseSubscriber(subscriber) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (!subscriber)
            return [0, 0, 0].map((x) => this.bcMissing);
        const name = ((_a = subscriber === null || subscriber === void 0 ? void 0 : subscriber.name) === null || _a === void 0 ? void 0 : _a.unparsed) || this.bcMissing;
        const address = ((_c = (_b = subscriber === null || subscriber === void 0 ? void 0 : subscriber.address) === null || _b === void 0 ? void 0 : _b.street) === null || _c === void 0 ? void 0 : _c.unparsed)
            ? `${(_e = (_d = subscriber === null || subscriber === void 0 ? void 0 : subscriber.address) === null || _d === void 0 ? void 0 : _d.street) === null || _e === void 0 ? void 0 : _e.unparsed}\n${(_g = (_f = subscriber === null || subscriber === void 0 ? void 0 : subscriber.address) === null || _f === void 0 ? void 0 : _f.location) === null || _g === void 0 ? void 0 : _g.unparsed}`
            : ((_j = (_h = subscriber === null || subscriber === void 0 ? void 0 : subscriber.address) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.unparsed) || this.bcMissing;
        const phone = ((_l = (_k = subscriber === null || subscriber === void 0 ? void 0 : subscriber.phone) === null || _k === void 0 ? void 0 : _k.number) === null || _l === void 0 ? void 0 : _l.unparsed) || ((_m = subscriber === null || subscriber === void 0 ? void 0 : subscriber.phone) === null || _m === void 0 ? void 0 : _m.unparsed) || this.bcMissing;
        return [name, address, phone];
    }
}
