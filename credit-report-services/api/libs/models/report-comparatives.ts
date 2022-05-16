import { MergeReport } from '@bravecredit/brave-sdk';

export class ReportComparatives {
  constructor(private prior: MergeReport, private current: MergeReport) {}
}
