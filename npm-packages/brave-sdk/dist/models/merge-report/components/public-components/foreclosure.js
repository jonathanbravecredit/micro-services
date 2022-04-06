"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Foreclosure = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class Foreclosure extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.dateSettled = null;
        this.liability = null;
        this.homogenize(_data);
    }
}
exports.Foreclosure = Foreclosure;
