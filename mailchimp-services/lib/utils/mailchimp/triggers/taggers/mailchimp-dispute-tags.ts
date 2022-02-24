import { IDispute } from 'lib/interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpDisputeTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ): IMailchimpPacket<IMarketingData>[] {
    let triggers: IMailchimpPacket<IMarketingData>[] = [];
    for (let key in triggerLibrary) {
      if (triggerLibrary[key](oldImage, newImage, event).test) {
        const { data } = triggerLibrary[key](oldImage, newImage, event);
        const packet = { template: key, data: data } as IMailchimpPacket<IMarketingData>;
        triggers = [...triggers, packet];
      }
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}

/**
 * Check for new disputes started
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: IMarketingData } => {
  if (event !== 'INSERT') return { test: false };

  const currOpenedOn = newImage.openedOn;
  const currDate = new Date(currOpenedOn || 0);

  if (currDate.toString().toLowerCase() !== 'invalid date') {
    return {
      test: true,
      data: {
        api: 'marketing',
        tag: [
          {
            name: 'disputed',
            status: 'active',
          },
          {
            name: 'no_disputed',
            status: 'inactive',
          },
        ],
      },
    };
  }
  return { test: false };
};

const triggerLibrary: Record<
  string,
  (
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ) => { test: boolean; data?: IMarketingData }
> = {
  [MailchimpTriggerEmails.DisputedTag]: checkOne,
};
