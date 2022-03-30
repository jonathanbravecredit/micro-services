import { TransunionMissing } from '../transunion-missing';
export declare class TransunionScrubbers extends TransunionMissing {
    constructor();
    /**
     * Removes the '__typename' fields from query results
     * @param {GetAppDataQuery} data
     * @returns
     */
    static scrubBackendData(data: any): any;
    static scrubAddressStreets(str: string): string;
    static scrubCities(str: string): string;
    static scrubName(str: string): string;
}
