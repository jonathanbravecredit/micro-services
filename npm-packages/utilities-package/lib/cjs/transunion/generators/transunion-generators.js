"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionGenerators = void 0;
const uuid = __importStar(require("uuid"));
const constants_1 = require("../constants");
class TransunionGenerators {
    constructor() { }
    /**
     * Helper method to generate the failed onboarding flow status
     * @param error
     * @returns
     */
    static createOnboardingStatus(process, successful, resp) {
        var _a, _b;
        const now = new Date();
        const code = resp ? ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.Code) || '-1' : successful ? '1' : '-1';
        const description = ((_b = resp === null || resp === void 0 ? void 0 : resp.error) === null || _b === void 0 ? void 0 : _b.Message) ||
            `${process} status: ${successful ? constants_1.TUStatusRefStatuses.Success : constants_1.TUStatusRefStatuses.Failed}`;
        return {
            id: uuid.v4(),
            status: successful ? constants_1.TUStatusRefStatuses.Success : constants_1.TUStatusRefStatuses.Failed,
            statusDescription: description,
            statusModifiedOn: now.toISOString(),
            statusCode: `${code}`,
        };
    }
}
exports.TransunionGenerators = TransunionGenerators;
