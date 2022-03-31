"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
class Name extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.prefix = null;
        this.first = null;
        this.middle = null;
        this.last = null;
        this.suffix = null;
        this.homogenize(_data);
    }
}
exports.Name = Name;
