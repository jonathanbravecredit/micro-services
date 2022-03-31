"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaritalItem = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
class MaritalItem extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.spouse = null;
        this.homogenize(_data);
    }
}
exports.MaritalItem = MaritalItem;
