import { IBankingPartition, IBankingRecord } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { BankingRecord } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BankingComponents/BankingRecord';

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
