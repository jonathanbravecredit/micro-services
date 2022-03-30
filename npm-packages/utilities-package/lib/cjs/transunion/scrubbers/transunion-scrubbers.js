"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionScrubbers = void 0;
const __1 = require("../..");
const transunion_missing_1 = require("../transunion-missing");
class TransunionScrubbers extends transunion_missing_1.TransunionMissing {
    constructor() {
        super();
    }
    /**
     * Removes the '__typename' fields from query results
     * @param {GetAppDataQuery} data
     * @returns
     */
    static scrubBackendData(data) {
        let clean = __1.Nested.delete(data, '__typename');
        clean = __1.Nested.delete(data, 'isFresh');
        delete clean.createdAt; // this is a graphql managed field
        delete clean.updatedAt; // this is a graphql managed field
        delete clean.owner; // this is a graphql managed field
        return clean;
    }
    static scrubAddressStreets(str) {
        return str.replace(/[^a-zA-Z0-9\@\' \.\,\#\-\:\;]/gim, '');
    }
    static scrubCities(str) {
        const scrubbed = str.replace(/[^A-Za-z ]/gm, '');
        return `${scrubbed[0].toUpperCase()}${scrubbed.substring(1).toLowerCase()}`;
    }
    static scrubName(str) {
        const scrubbed = str.replace(/[A-Za-z' -]/gm, '');
        return `${scrubbed[0].toUpperCase()}${scrubbed.substring(1).toLowerCase()}`;
    }
}
exports.TransunionScrubbers = TransunionScrubbers;
