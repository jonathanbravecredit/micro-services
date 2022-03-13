import 'reflect-metadata';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'MailchimpData' })
export class MailchimpData {
  @PartitionKey()
  userId: string | undefined;

  @SortKey()
  messageId: string | undefined;

  userEmail: string | undefined;

  createdOn: number | undefined;

  scheduledFor: number | undefined;
}
