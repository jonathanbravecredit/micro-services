"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionUtil = void 0;
const transunion_filters_1 = require("./filters/transunion-filters");
const transunion_parsers_1 = require("./parsers/transunion-parsers");
const transunion_queries_1 = require("./queries/transunion-queries");
const transunion_sorters_1 = require("./sorters/transunion-sorters");
const transunion_scrubbers_1 = require("./scrubbers/transunion-scrubbers");
// start building this out to handle all the data from TU
class TransunionUtil {
}
exports.TransunionUtil = TransunionUtil;
TransunionUtil.sorters = transunion_sorters_1.TransunionSorters;
TransunionUtil.parsers = transunion_parsers_1.TransunionParsers;
TransunionUtil.queries = transunion_queries_1.TransunionQueries;
TransunionUtil.filters = transunion_filters_1.TransunionFilters;
TransunionUtil.scrubbers = transunion_scrubbers_1.TransunionScrubbers;
