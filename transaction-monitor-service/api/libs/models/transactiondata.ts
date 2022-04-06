import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'TransactionsData' })
export class TransactionData {
  @PartitionKey()
  id!: string;
  @SortKey()
  sortKey!: string;

  timeToLive!: number; // in seconds not milliseconds
}
