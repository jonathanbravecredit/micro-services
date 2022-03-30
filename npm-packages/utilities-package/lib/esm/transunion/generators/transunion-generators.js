import * as uuid from 'uuid';
import { TUStatusRefStatuses } from '../constants';
export class TransunionGenerators {
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
            `${process} status: ${successful ? TUStatusRefStatuses.Success : TUStatusRefStatuses.Failed}`;
        return {
            id: uuid.v4(),
            status: successful ? TUStatusRefStatuses.Success : TUStatusRefStatuses.Failed,
            statusDescription: description,
            statusModifiedOn: now.toISOString(),
            statusCode: `${code}`,
        };
    }
}
