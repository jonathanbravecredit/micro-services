import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Ads' })
export class Ad {
  @PartitionKey()
  id!: string;
  imageLink: string | undefined;
  active: boolean = false;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}
