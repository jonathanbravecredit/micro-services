import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class InquirySummaryInfo extends Homogenize<Partial<InquirySummaryInfo>> {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: Partial<InquirySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
