import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Ads' })
export class Ad {
  @PartitionKey()
  id!: string;
  imageLink: string | undefined;
  title: string | undefined;
  recommended: string | undefined;
  creditCheck: string | undefined;
  annual: string | undefined;
  textOne: string | undefined;
  textTwo: string | undefined;
  textThree: string | undefined;
  active: boolean = false;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}
