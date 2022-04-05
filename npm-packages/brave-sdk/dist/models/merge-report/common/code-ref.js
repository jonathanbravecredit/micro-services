"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeRef = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
class CodeRef extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.abbreviation = null;
        this.description = null;
        this.symbol = null;
        this.rank = null;
        this.homogenize(_data);
    }
}
exports.CodeRef = CodeRef;
