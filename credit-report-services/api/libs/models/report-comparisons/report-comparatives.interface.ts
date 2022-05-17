import { ComparisonUpdates } from 'libs/models/report-comparisons/report-comparisons.constants';

export type Comparisons = {
  negative_accounts: Delta;
  credit_mix: Delta;
  credit_utilization: Delta;
  forbearance: Delta;
  databreaches: Delta;
};

export interface Delta {
  priorValue: any;
  currentValue: any;
  delta: ComparisonUpdates;
}
