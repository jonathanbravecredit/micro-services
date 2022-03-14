import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { IMergeReport } from 'lib/interfaces/mergereport.interface';

// add credit report data model
@Model({ tableName: 'CreditReports' })
export class CreditReport {
  @PartitionKey()
  userId!: string;

  @SortKey()
  version!: number;

  currentVersion: number | undefined;

  bureau!: string;

  report!: IMergeReport;

  createdOn!: string | null;

  modifiedOn!: string | null;
}
