import { Comparisons, Delta } from 'libs/models/report-comparisons/report-comparatives.interface';

export enum ComparisonUpdates {
  NoChange = 'no_change',
  Changed = 'change',
}

export const DELTA_DEFAULT: Delta = {
  priorValue: -1,
  currentValue: -1,
  delta: ComparisonUpdates.NoChange,
};

export const COMPARISON_DEFAULT: Partial<Comparisons> = {
  negative_accounts: DELTA_DEFAULT,
  credit_mix: DELTA_DEFAULT,
  credit_utilization: DELTA_DEFAULT,
};
