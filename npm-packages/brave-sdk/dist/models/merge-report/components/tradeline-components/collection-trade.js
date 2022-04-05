"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionTrade = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class CollectionTrade extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.actualPaymentAmount = null;
        this.originalCreditor = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.creditType = new code_ref_1.CodeRef(this.creditType);
    }
}
exports.CollectionTrade = CollectionTrade;
