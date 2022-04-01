import { TransunionFilters } from '../filters';
import { DataBreaches, EXPERIAN_STATES, KROGER_STATES } from '../../_constants/transunion';
const dataBreachCondition1 = ({ address, tradelines, }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== 'ca')
        return DataBreaches.None;
    const carLoan = TransunionFilters.filterTradelinesByIndustryCode(tradelines, 'BA');
    if (carLoan.length > 0)
        return DataBreaches.Condition1;
    return DataBreaches.None;
};
const dataBreachCondition2 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'ca')
        return DataBreaches.Condition2;
    return DataBreaches.None;
};
const dataBreachCondition3 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'co')
        return DataBreaches.Condition3;
    return DataBreaches.None;
};
const dataBreachCondition4 = ({ address }) => {
    var _a, _b;
    const code = (_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    if (!code)
        return DataBreaches.None;
    return KROGER_STATES[code] ? DataBreaches.Condition4 : DataBreaches.None;
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
        return DataBreaches.Condition5;
    return DataBreaches.None;
};
const dataBreachCondition6 = ({ address }) => {
    var _a, _b;
    if (((_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'wa')
        return DataBreaches.Condition6;
    return DataBreaches.None;
};
const dataBreachCondition7 = ({ address }) => {
    var _a, _b;
    const code = (_b = (_a = address === null || address === void 0 ? void 0 : address.CreditAddress) === null || _a === void 0 ? void 0 : _a.stateCode) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    if (!code)
        return DataBreaches.None;
    return EXPERIAN_STATES[code] ? DataBreaches.Condition7 : DataBreaches.None;
};
export const DataBreachConditions = {
    [DataBreaches.Condition1]: dataBreachCondition1,
    [DataBreaches.Condition2]: dataBreachCondition2,
    [DataBreaches.Condition3]: dataBreachCondition3,
    [DataBreaches.Condition4]: dataBreachCondition4,
    [DataBreaches.Condition5]: dataBreachCondition5,
    [DataBreaches.Condition6]: dataBreachCondition6,
    [DataBreaches.Condition7]: dataBreachCondition7,
};
