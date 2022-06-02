import { IBankingPartition, IBankingRecord } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { BankingRecord } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/BankingComponents/BankingRecord';

export class BankingPartition extends Homogenize<Partial<IBankingPartition>> implements IBankingPartition {
  BankingRecord: IBankingRecord[] = [];

  constructor(_data: Partial<IBankingPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BankingRecord = this.homogenizeArray<IBankingRecord, BankingRecord>(this.BankingRecord, BankingRecord);
  }
}
