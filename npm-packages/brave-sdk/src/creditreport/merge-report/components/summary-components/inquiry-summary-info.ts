import { IInquirySummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class InquirySummaryInfo extends Homogenize<Partial<IInquirySummaryInfo>> implements IInquirySummaryInfo {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: Partial<IInquirySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
