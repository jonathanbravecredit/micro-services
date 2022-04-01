"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remark = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("./code-ref");
class Remark extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.customRemark = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.RemarkCode = new code_ref_1.CodeRef(this.RemarkCode);
    }
}
exports.Remark = Remark;
