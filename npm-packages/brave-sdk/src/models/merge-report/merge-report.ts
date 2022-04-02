import { IMergeReport } from '../../types/merge-report';
import { Homogenize } from '../../utils/homogenize/homogenize-data';
import { TrueLinkCreditReportType } from './components/truelink-credit-report';

/**
 * Rules for merge report.
 * 1. primitives can terminate in a value or null
 * 2. no leaves can be undefined and must conform to class properties that define it
 * 3. arrays can ONLY terminate in an empty array
 * 4. complex objects CANNOT terminate in a null. Must go to leaves
 */
export class MergeReport extends Homogenize<Partial<IMergeReport>> {
  TrueLinkCreditReportType!: TrueLinkCreditReportType;
  constructor(_data: Partial<IMergeReport>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TrueLinkCreditReportType = new TrueLinkCreditReportType(this.TrueLinkCreditReportType);
  }
}
