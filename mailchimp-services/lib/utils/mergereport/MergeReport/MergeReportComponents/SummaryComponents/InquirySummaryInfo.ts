import { IInquirySummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

export class InquirySummaryInfo extends Homogenize<Partial<IInquirySummaryInfo>> implements IInquirySummaryInfo {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: Partial<IInquirySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
