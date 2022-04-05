"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicPartition = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const public_record_1 = require("./public-components/public-record");
class PublicPartition extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.PublicRecord = new public_record_1.PublicRecord(this.PublicRecord);
    }
}
exports.PublicPartition = PublicPartition;
