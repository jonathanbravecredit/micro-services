import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'TransactionsData' })
export class TransactionData {
  @PartitionKey()
  id!: string;
  @SortKey()
  sortKey!: string;

  timeToLive!: number; // in seconds not milliseconds
}

export class TransactionDataMaker implements TransactionData {
  constructor(public id: string, public sortKey: string, public timeToLive: number) {}
}
