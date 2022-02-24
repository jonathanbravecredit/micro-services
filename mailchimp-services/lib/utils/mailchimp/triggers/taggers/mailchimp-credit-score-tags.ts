import { ICreditScoreTrackings } from 'lib/interfaces/credit-score-trackings.interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpCreditScoreTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: ICreditScoreTrackings,
    newImage: ICreditScoreTrackings,
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
 * Check current credit score
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (
  oldImage: ICreditScoreTrackings,
  newImage: ICreditScoreTrackings,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: IMarketingData } => {
  // return true;
  if (event !== 'MODIFY') return { test: false }; // modify only
  const { currentScore } = newImage;
  if (currentScore && (currentScore || 0) < 650) {
    // remove that or when you get back to this
    return {
      test: true,
      data: {
        api: 'marketing',
        tag: [
          {
            name: 'under_650',
            status: 'active',
          },
          {
            name: 'over_650',
            status: 'inactive',
          },
        ],
      },
    };
  } else {
    return {
      test: true,
      data: {
        api: 'marketing',
        tag: [
          {
            name: 'under_650',
            status: 'inactive',
          },
          {
            name: 'over_650',
            status: 'active',
          },
        ],
      },
    };
  }
};

const triggerLibrary: Record<
  string,
  (
    oldImage: ICreditScoreTrackings,
    newImage: ICreditScoreTrackings,
    event: 'INSERT' | 'MODIFY',
  ) => { test: boolean; data?: IMarketingData }
> = {
  [MailchimpTriggerEmails.LessThan650]: checkOne,
};
