import { IMailchimpPacket, IMarketingData } from 'libs/utils/mailchimp/interfaces';

export interface Resolver<T> {
  resolver: (
    oldImage: T | null,
    newImage: T,
    event: 'MODIFY' | 'INSERT' | 'DELETE',
  ) => IMailchimpPacket<IMarketingData>[];
}
