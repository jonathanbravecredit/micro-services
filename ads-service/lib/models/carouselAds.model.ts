import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'CarouselAds' })
export class CarouselAd {
  @PartitionKey()
  id!: string;
  imageLink: string | undefined;
  title: string | undefined;
  recommended: string | undefined;
  creditCheck: string | undefined;
  annual: string | undefined;
  textOne: string | undefined;
  textTwo: string | undefined;
  active: boolean = false;
  textThree: string | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}
