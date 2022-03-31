"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Social = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const source_1 = require("../../common/source");
class Social extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.SocialSecurityNumber = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new source_1.Source(this.Source);
    }
}
exports.Social = Social;
