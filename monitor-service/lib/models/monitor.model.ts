import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Monitors' })
export class Monitor {
  @PartitionKey()
  id!: string;

}
