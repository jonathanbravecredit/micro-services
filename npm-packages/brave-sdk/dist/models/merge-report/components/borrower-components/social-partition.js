"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPartition = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const social_1 = require("./social");
class SocialPartition extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.Social = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Social = this.homogenizeArray(this.Social, social_1.Social);
    }
}
exports.SocialPartition = SocialPartition;
