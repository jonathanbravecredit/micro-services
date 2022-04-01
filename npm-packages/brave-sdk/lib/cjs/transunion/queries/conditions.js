"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBreachConditions = void 0;
const filters_1 = require("../filters");
const transunion_1 = require("../../_constants/transunion");
const dataBreachCondition1 = ({ address, tradelines, }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== 'ca')
        return transunion_1.DataBreaches.None;
    const carLoan = filters_1.TransunionFilters.filterTradelinesByIndustryCode(tradelines, 'BA');
    if (carLoan.length > 0)
        return transunion_1.DataBreaches.Condition1;
    return transunion_1.DataBreaches.None;
};
const dataBreachCondition2 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'ca')
        return transunion_1.DataBreaches.Condition2;
    return transunion_1.DataBreaches.None;
};
const dataBreachCondition3 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'co')
        return transunion_1.DataBreaches.Condition3;
    return transunion_1.DataBreaches.None;
};
const dataBreachCondition4 = ({ address }) => {
    var _a, _b;
    const code = (_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    if (!code)
        return transunion_1.DataBreaches.None;
    return transunion_1.KROGER_STATES[code] ? transunion_1.DataBreaches.Condition4 : transunion_1.DataBreaches.None;
};
const dataBreachCondition5 = ({ inquiries }) => {
    const results = inquiries.filter((i) => {
        var _a;
        const name = ((_a = i === null || i === void 0 ? void 0 : i.Inquiry) === null || _a === void 0 ? void 0 : _a.subscriberName) || '';
        if (name.toLowerCase().indexOf('t-mobile') >= 0)
            return true;
        if (name.toLowerCase().indexOf('tmobile') >= 0)
            return true;
        if (name.toLowerCase().indexOf('t mobile') >= 0)
            return true;
        return false;
    });
    if (results.length > 0)
        return transunion_1.DataBreaches.Condition5;
    return transunion_1.DataBreaches.None;
};
const dataBreachCondition6 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'wa')
        return transunion_1.DataBreaches.Condition6;
    return transunion_1.DataBreaches.None;
};
const dataBreachCondition7 = ({ address }) => {
    var _a, _b;
    const code = (_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    if (!code)
        return transunion_1.DataBreaches.None;
    return transunion_1.EXPERIAN_STATES[code] ? transunion_1.DataBreaches.Condition7 : transunion_1.DataBreaches.None;
};
exports.DataBreachConditions = {
    [transunion_1.DataBreaches.Condition1]: dataBreachCondition1,
    [transunion_1.DataBreaches.Condition2]: dataBreachCondition2,
    [transunion_1.DataBreaches.Condition3]: dataBreachCondition3,
    [transunion_1.DataBreaches.Condition4]: dataBreachCondition4,
    [transunion_1.DataBreaches.Condition5]: dataBreachCondition5,
    [transunion_1.DataBreaches.Condition6]: dataBreachCondition6,
    [transunion_1.DataBreaches.Condition7]: dataBreachCondition7,
};
