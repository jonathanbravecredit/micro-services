import { IBankingPartition, IBankingRecord } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { BankingRecord } from './banking-components/banking-record';

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
