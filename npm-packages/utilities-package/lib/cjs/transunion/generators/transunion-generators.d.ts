import { ITUServiceResponse, TUStatusRefInput } from '../interfaces/common-tu.interface';
export declare class TransunionGenerators {
    constructor();
    /**
     * Helper method to generate the failed onboarding flow status
     * @param error
     * @returns
     */
    static createOnboardingStatus(process: string, successful: boolean, resp?: ITUServiceResponse<any | undefined>): TUStatusRefInput;
}
