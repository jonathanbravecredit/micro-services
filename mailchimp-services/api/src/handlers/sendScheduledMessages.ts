import 'reflect-metadata';
const MailChimpTx = require('@mailchimp/mailchimp_transactional/src');
import { Handler, ScheduledEvent } from 'aws-lambda';
import { MailchimpData } from 'libs/models/outgoing-messages.model';
import {
  batchDeleteAllItemsInOutgoingMessages,
  getAllItemsInOutgoingMessages,
} from 'libs/queries/outgoing-messages.queries';
import { getSecretKey } from 'libs/utils/secrets';

let mailChimp: {
  messages: {
    sendTemplate: (arg0: {
      template_name: string | undefined;
      template_content: {}[];
      message: { to: { email: string | undefined; type: string }[] };
    }) => any;
  };
};
const mailchimpSKLoc = process.env.MAILCHIMP_SECRET_LOCATION || '';

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  const outgoing: MailchimpData[] = await getAllItemsInOutgoingMessages();
  let chunks: any = [];

  // chunk
  for (let i = 0; i < outgoing.length; i += 25) {
    chunks.push(outgoing.slice(i, i + 25));
  }

  try {
    const secretJSON = await getSecretKey(mailchimpSKLoc);
    if (!secretJSON) throw `Cannot retrieve secret key`;
    const { mailchimpTx: secret } = JSON.parse(secretJSON);
    mailChimp = new MailChimpTx(secret);
  } catch (err) {
    return;
  }

  try {
    for (let chunk of chunks) {
      let resp = await Promise.all(
        chunk.map(async (msg: MailchimpData) => {
          const mailMessage = {
            to: [
              {
                email: msg.userEmail,
                type: 'to',
              },
            ],
          };
          await mailChimp.messages.sendTemplate({
            template_name: msg.messageId,
            template_content: [{}],
            message: mailMessage,
          });
        }),
      );
      console.log('sent: ', resp);
      const purged = await batchDeleteAllItemsInOutgoingMessages(chunk);
      console.log('purged: ', purged);
    }
  } catch (err) {
    console.log(err);
  }
};
