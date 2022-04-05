"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxLien = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class TaxLien extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateReleased = null;
        this.homogenize(_data);
    }
}
exports.TaxLien = TaxLien;
