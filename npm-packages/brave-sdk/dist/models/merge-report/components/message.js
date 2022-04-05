"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../common/code-ref");
class Message extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Code = new code_ref_1.CodeRef(this.Code);
        this.Type = new code_ref_1.CodeRef(this.Type);
    }
}
exports.Message = Message;
