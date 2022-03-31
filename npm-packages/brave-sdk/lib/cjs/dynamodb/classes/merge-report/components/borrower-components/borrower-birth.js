"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerBirth = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const source_1 = require("../../common/source");
const tu_date_1 = require("../../common/tu-date");
class BorrowerBirth extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.date = null;
        this.age = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BirthDate = new tu_date_1.TUDate(this.BirthDate);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BorrowerBirth = BorrowerBirth;
