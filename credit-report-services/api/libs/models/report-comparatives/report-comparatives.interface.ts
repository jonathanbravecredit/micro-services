import { ComparativeUpdates } from 'libs/models/report-comparatives/report-comparatives.constants';

export type Comparatives = {
  negative_accounts: Delta;
  credit_mix: Delta;
  credit_utilization: Delta;
  forbearance: Delta;
  databreaches: Delta;
};

export interface Delta {
  priorValue: any;
  currentValue: any;
  delta: ComparativeUpdates;
}
