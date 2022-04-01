"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_TYPES = exports.AccountTypes = void 0;
var AccountTypes;
(function (AccountTypes) {
    AccountTypes["LineOfCredit"] = "Line of credit";
    AccountTypes["Installment"] = "Installment account";
    AccountTypes["Mortgage"] = "Primary or secondary mortgage";
    AccountTypes["Open"] = "Open account";
    AccountTypes["Revolving"] = "Revolving account";
    AccountTypes["Unknown"] = "Unknown";
    AccountTypes["Collection"] = "Collection account";
})(AccountTypes = exports.AccountTypes || (exports.AccountTypes = {}));
exports.ACCOUNT_TYPES = {
    c: AccountTypes.LineOfCredit,
    r: AccountTypes.Revolving,
    o: AccountTypes.Open,
    u: AccountTypes.Unknown,
    y: AccountTypes.Collection,
    i: AccountTypes.Installment,
    m: AccountTypes.Mortgage,
};
