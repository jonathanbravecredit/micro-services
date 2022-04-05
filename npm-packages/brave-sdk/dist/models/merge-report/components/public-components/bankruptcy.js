"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bankruptcy = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class Bankruptcy extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.courtNumber = null;
        this.division = null;
        this.assetAmount = null;
        this.dateResolved = null;
        this.exemptAmount = null;
        this.liabilityAmount = null;
        this.trustee = null;
        this.company = null;
        this.thirdParty = null;
        this.homogenize(_data);
    }
}
exports.Bankruptcy = Bankruptcy;
