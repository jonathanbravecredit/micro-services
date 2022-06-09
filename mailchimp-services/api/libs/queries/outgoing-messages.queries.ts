import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { MailchimpData } from 'libs/models/outgoing-messages.model';

const OutgoingMessagesStore = new DynamoStore(MailchimpData);

export const getAllItemsInOutgoingMessages = (): Promise<MailchimpData[]> => {
  return OutgoingMessagesStore.scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const batchDeleteAllItemsInOutgoingMessages = (items: MailchimpData[]): Promise<void> => {
  return OutgoingMessagesStore.batchWrite()
    .delete(items)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
