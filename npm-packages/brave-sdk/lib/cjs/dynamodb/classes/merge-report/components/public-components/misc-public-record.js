"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscPublicRecord = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
class MiscPublicRecord extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.miscInformation = null;
        this.homogenize(_data);
    }
}
exports.MiscPublicRecord = MiscPublicRecord;
