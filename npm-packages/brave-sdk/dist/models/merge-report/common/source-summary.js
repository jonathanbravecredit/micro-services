"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceSummary = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const source_1 = require("./source");
class SourceSummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new source_1.Source(this.Source);
    }
}
exports.SourceSummary = SourceSummary;
