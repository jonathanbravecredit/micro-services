"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumber = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class PhoneNumber extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.AreaCode = null;
        this.Number = null;
        this.Extension = null;
        this.homogenize(_data);
    }
}
exports.PhoneNumber = PhoneNumber;
