import { TransunionScrubbers } from './scrubbers/transunion-scrubbers';
import { TransunionFilters } from './filters/transunion-filters';
import { TransunionParsers } from './parsers/transunion-parsers';
import { TransunionQueries } from './queries/transunion-queries';
import { TransunionSorters } from './sorters/transunion-sorters';
import { TransunionMissing } from './transunion-missing';
export declare class TransunionUtil extends TransunionMissing {
    static sorters: typeof TransunionSorters;
    static parsers: typeof TransunionParsers;
    static queries: typeof TransunionQueries;
    static filters: typeof TransunionFilters;
    static scrubbers: typeof TransunionScrubbers;
    constructor();
}
