import { IEmailParams } from 'lib/interfaces/nodemailer.interfaces';

export const generateEmailParams = (subj: string, emails: string[] = ['']): IEmailParams => {
  const from = 'support@brave.credit';
  const subject = subj || 'Your registered user reports';
  const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head></head>
            <body>
                    <h1>${subj || 'Your registered user reports'}</h1>
            </body>
        </html>`;
  const to = emails;

  return {
    from,
    subject,
    html,
    to,
    // bcc: Any BCC address you want here in an array,
  };
};
