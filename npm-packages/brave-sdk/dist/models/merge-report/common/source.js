"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("./code-ref");
class Source extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.BorrowerKey = null;
        this.InquiryDate = null;
        this.Reference = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Bureau = new code_ref_1.CodeRef(this.Bureau);
    }
}
exports.Source = Source;
