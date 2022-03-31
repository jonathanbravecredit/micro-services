"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerBureauIdentifier = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const source_1 = require("../../common/source");
class BorrowerBureauIdentifier extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.type = null;
        this.identifier = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BorrowerBureauIdentifier = BorrowerBureauIdentifier;
