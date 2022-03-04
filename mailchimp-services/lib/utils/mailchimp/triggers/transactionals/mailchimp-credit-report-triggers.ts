import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, ITransactionalData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpCreditReportTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: CreditReport | null,
    newImage: CreditReport,
    event: 'INSERT' | 'MODIFY',
  ): IMailchimpPacket<ITransactionalData>[] {
    let triggers: IMailchimpPacket<ITransactionalData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage, event);
      triggers = test ? (triggers = [...triggers, { template: key, data: data }]) : triggers;
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
  oldImage: CreditReport | null,
  newImage: CreditReport,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ITransactionalData } => {
  if (event !== 'INSERT') return { test: false };
  return {
    test: true,
    data: {
      api: 'transactional',
    },
  };
};

const triggerLibrary: Record<
  string,
  (
    oldImage: CreditReport | null,
    newImage: CreditReport,
    event: 'INSERT' | 'MODIFY',
  ) => { test: boolean; data?: ITransactionalData }
> = {
  [MailchimpTriggerEmails.ReportRefreshed]: checkOne,
};
