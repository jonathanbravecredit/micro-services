import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'InvestigationResults' })
export class InvestigationResult {
  @PartitionKey()
  id!: string;

  @SortKey()
  userId!: string;

  record: string | undefined;

  createdOn: string | undefined;

  modifiedOn: string | undefined;
}
