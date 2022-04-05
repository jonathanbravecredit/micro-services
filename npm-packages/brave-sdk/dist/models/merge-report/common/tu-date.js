"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUDate = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
class TUDate extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.month = null;
        this.year = null;
        this.day = null;
        this.homogenize(_data);
    }
}
exports.TUDate = TUDate;
