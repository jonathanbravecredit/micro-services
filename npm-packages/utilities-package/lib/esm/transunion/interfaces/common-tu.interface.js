export var AccountTypes;
(function (AccountTypes) {
    AccountTypes["LineOfCredit"] = "Line of credit";
    AccountTypes["Installment"] = "Installment account";
    AccountTypes["Mortgage"] = "Primary or secondary mortgage";
    AccountTypes["Open"] = "Open account";
    AccountTypes["Revolving"] = "Revolving account";
    AccountTypes["Unknown"] = "Unknown";
    AccountTypes["Collection"] = "Collection account";
})(AccountTypes || (AccountTypes = {}));
export const ACCOUNT_TYPES = {
    c: AccountTypes.LineOfCredit,
    r: AccountTypes.Revolving,
    o: AccountTypes.Open,
    u: AccountTypes.Unknown,
    y: AccountTypes.Collection,
    i: AccountTypes.Installment,
    m: AccountTypes.Mortgage,
};
