import { IPublicRecordSummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class PublicRecordSummaryInfo
  extends Homogenize<Partial<IPublicRecordSummaryInfo>>
  implements IPublicRecordSummaryInfo
{
  NumberOfRecords: number | string | null = null;

  constructor(_data: Partial<IPublicRecordSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
