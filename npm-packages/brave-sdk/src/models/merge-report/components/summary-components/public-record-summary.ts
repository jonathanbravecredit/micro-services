import { IPublicRecordSummary, IPublicRecordSummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { PublicRecordSummaryInfo } from './public-record-summary-info';

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
