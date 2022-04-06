"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingPartition = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const banking_record_1 = require("./banking-components/banking-record");
class BankingPartition extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.BankingRecord = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BankingRecord = this.homogenizeArray(this.BankingRecord, banking_record_1.BankingRecord);
    }
}
exports.BankingPartition = BankingPartition;
