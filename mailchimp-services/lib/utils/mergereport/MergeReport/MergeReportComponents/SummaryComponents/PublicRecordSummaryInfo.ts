import { IPublicRecordSummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

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
