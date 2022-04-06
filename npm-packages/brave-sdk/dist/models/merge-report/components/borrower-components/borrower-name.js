"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerName = void 0;
const utils_1 = require("../../../../utils");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
const tu_name_1 = require("./tu-name");
class BorrowerName extends utils_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Name = new tu_name_1.TUName(this.Name);
        this.NameType = new code_ref_1.CodeRef(this.NameType);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BorrowerName = BorrowerName;
