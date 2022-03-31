"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredItem = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class RegisteredItem extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.Security = [];
        this.originalBalance = null;
        this.dateMatures = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Security = this.homogenizeArray(this.Security, code_ref_1.CodeRef);
    }
}
exports.RegisteredItem = RegisteredItem;
