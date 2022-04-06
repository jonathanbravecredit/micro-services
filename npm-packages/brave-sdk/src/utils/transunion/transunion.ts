import { TransunionFilters } from './filters/transunion-filters';
import { TransunionParsers } from './parsers/transunion-parsers';
import { TransunionQueries } from './queries/transunion-queries';
import { TransunionSorters } from './sorters/transunion-sorters';
import { TransunionScrubbers } from './scrubbers/transunion-scrubbers';

// start building this out to handle all the data from TU
export class TransunionUtil {
  static sorters = TransunionSorters;
  static parsers = TransunionParsers;
  static queries = TransunionQueries;
  static filters = TransunionFilters;
  static scrubbers = TransunionScrubbers;
}
