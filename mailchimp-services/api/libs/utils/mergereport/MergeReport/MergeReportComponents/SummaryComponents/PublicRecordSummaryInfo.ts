import { IPublicRecordSummaryInfo } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

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
