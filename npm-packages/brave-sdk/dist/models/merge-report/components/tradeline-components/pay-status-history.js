"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayStatusHistory = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const monthly_pay_status_item_1 = require("./monthly-pay-status-item");
class PayStatusHistory extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.MonthlyPayStatus = [];
        this.startDate = null;
        this.status = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.MonthlyPayStatus = this.homogenizeArray(this.MonthlyPayStatus, monthly_pay_status_item_1.MonthlyPayStatusItem);
    }
}
exports.PayStatusHistory = PayStatusHistory;
