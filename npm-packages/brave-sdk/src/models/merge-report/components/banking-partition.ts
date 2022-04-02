import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { BankingRecord } from './banking-components/banking-record';

export class BankingPartition extends Homogenize<Partial<BankingPartition>> {
  BankingRecord: BankingRecord[] = [];

  constructor(_data: Partial<BankingPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BankingRecord = this.homogenizeArray<BankingRecord, BankingRecord>(this.BankingRecord, BankingRecord);
  }
}
