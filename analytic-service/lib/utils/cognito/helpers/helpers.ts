import { IEmailParams, IFormatDataResults } from 'lib/utils/cognito/helpers/helpers.interfaces';

export const flattenUser = (user: any, key: string): string => {
  const matches = user.filter((attr: { Name: string; Value: any }) => {
    return attr.Name === key;
  });
  if (matches.length) {
    return matches[0].Value;
  }
  return '';
};

export const formatData = (data: any): IFormatDataResults[] => {
  let fileArr: IFormatDataResults[] = data.map(
    (user: {
      Attributes: any;
      Username: any;
      UserCreateDate: { toISOString: () => any };
      Enabled: any;
      UserStatus: any;
    }) => {
      let attrs = {
        sub: flattenUser(user.Attributes, 'sub'),
        email_verified: flattenUser(user.Attributes, 'email_verified'),
        email: flattenUser(user.Attributes, 'email'),
      };

      return {
        userName: user.Username,
        userCreateDate: user.UserCreateDate.toISOString(),
        enabled: user.Enabled,
        userStatus: user.UserStatus,
        ...attrs,
      };
    },
  );
  return JSON.parse(JSON.stringify(fileArr)) as IFormatDataResults[];
};

export const generateReferralEmailParams = (subj: string = 'Your referral reports'): IEmailParams => {
  const from = 'support@brave.credit';
  const subject = `${subj}`;
  const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head></head>
            <body>
                    <h1>${subj}</h1>
            </body>
        </html>`;
  const to = process.env.NODE_ENV === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];

  return {
    from,
    subject,
    html,
    to,
    // bcc: Any BCC address you want here in an array,
  };
};
