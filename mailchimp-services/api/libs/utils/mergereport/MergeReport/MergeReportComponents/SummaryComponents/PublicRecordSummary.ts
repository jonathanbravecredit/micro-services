import { IPublicRecordSummary, IPublicRecordSummaryInfo } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { PublicRecordSummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/PublicRecordSummaryInfo';

export class PublicRecordSummary extends Homogenize<Partial<IPublicRecordSummary>> implements IPublicRecordSummary {
  Experian!: IPublicRecordSummaryInfo;
  Equifax!: IPublicRecordSummaryInfo;
  TransUnion!: IPublicRecordSummaryInfo;
  Merge!: IPublicRecordSummaryInfo;

  constructor(_data: Partial<IPublicRecordSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Experian = new PublicRecordSummaryInfo(this.Experian);
    this.Equifax = new PublicRecordSummaryInfo(this.Equifax);
    this.TransUnion = new PublicRecordSummaryInfo(this.TransUnion);
    this.Merge = new PublicRecordSummaryInfo(this.Merge);
  }
}
