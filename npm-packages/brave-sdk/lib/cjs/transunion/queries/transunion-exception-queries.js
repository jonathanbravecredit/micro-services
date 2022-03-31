"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionExceptionQueries = void 0;
const transunion_1 = require("../../_constants/transunion");
class TransunionExceptionQueries {
    constructor() { }
    static getErrorCodeDetails(code) {
        const detail = transunion_1.TRANSUNION_ERROR_CODES[code];
        return !detail
            ? transunion_1.TRANSUNION_ERROR_CODES['11'] // non-specific error
            : detail;
    }
    static isErrorCritical(resp) {
        const { error: { Code, Message, Name } = {} } = resp;
        const { keyWords } = transunion_1.TRANSUNION_CRITICAL_ERRORS[`${Code}`] || {};
        if (!keyWords)
            return false;
        const found = keyWords.find((w) => {
            const msg = (Message === null || Message === void 0 ? void 0 : Message.toLowerCase()) || '';
            const name = (Name === null || Name === void 0 ? void 0 : Name.toLowerCase()) || '';
            const word = w.toLowerCase();
            return msg.indexOf(word) >= 0 || name.indexOf(word) >= 0;
        });
        return found ? true : false;
    }
    static isPinStale(pinAge) {
        // 15 minutes in millisends...is now in milliseconds greater than the age
        const _MS_MINS = 15 * 60 * 1000;
        const now = new Date();
        const ms = now.valueOf();
        return ms - pinAge >= _MS_MINS;
    }
    static isKBAStale(kbaAge) {
        // 96 hours in milliseconds...is now in ms greater than age
        const _MS_HOURS = 96 * 60 * 60 * 1000;
        const now = new Date();
        const ms = now.valueOf();
        return ms - kbaAge >= _MS_HOURS;
    }
}
exports.TransunionExceptionQueries = TransunionExceptionQueries;
