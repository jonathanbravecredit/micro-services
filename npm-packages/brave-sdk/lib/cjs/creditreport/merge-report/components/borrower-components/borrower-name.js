"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerName = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
const name_1 = require("./name");
class BorrowerName extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Name = new name_1.Name(this.Name);
        this.NameType = new code_ref_1.CodeRef(this.NameType);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BorrowerName = BorrowerName;
