"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garnishment = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class Garnishment extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateSatisfied = null;
        this.garnishee = null;
        this.plaintiff = null;
        this.homogenize(_data);
    }
}
exports.Garnishment = Garnishment;
