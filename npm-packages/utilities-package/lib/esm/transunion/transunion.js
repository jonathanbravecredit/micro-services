import { TransunionScrubbers } from './scrubbers/transunion-scrubbers';
import { TransunionFilters } from './filters/transunion-filters';
import { TransunionParsers } from './parsers/transunion-parsers';
import { TransunionQueries } from './queries/transunion-queries';
import { TransunionSorters } from './sorters/transunion-sorters';
import { TransunionMissing } from './transunion-missing';
// start building this out to handle all the data from TU
export class TransunionUtil extends TransunionMissing {
    constructor() {
        super();
    }
}
TransunionUtil.sorters = TransunionSorters;
TransunionUtil.parsers = TransunionParsers;
TransunionUtil.queries = TransunionQueries;
TransunionUtil.filters = TransunionFilters;
TransunionUtil.scrubbers = TransunionScrubbers;
