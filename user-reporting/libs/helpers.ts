import * as AWS from 'aws-sdk';
import { IEmailParams } from 'libs/interfaces/helper.interfaces';
import * as util from 'util';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-east-2',
});
const USER_POOL_ID = process.env.POOL;
const STAGE = process.env.STAGE;
const pullUsers: any = util.promisify(cognitoidentityserviceprovider.listUsers.bind(cognitoidentityserviceprovider));

export const formatDate = (date: string | number | Date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const flattenUser = (user: { Name: string; Value: string }[] | undefined, key: string): string => {
  if (!user) return '';
  const matches = user.filter((attr: { Name: string; Value: any }) => {
    return attr.Name === key;
  });
  if (matches.length) {
    return matches[0].Value;
  }
  return '';
};

export const getUsers = async (token: string, limit: number) => {
  let results: any[] = [];

  const getUsersRecurse = async (token: string | null | undefined, limit = 60) => {
    if (token === null || token === undefined) {
      // Finish operations
      return;
    }
    let params = {};
    if (token) {
      params = {
        UserPoolId: USER_POOL_ID /* required */,
        Limit: 60,
        PaginationToken: token,
      };
    } else {
      params = {
        UserPoolId: USER_POOL_ID /* required */,
        Limit: 60,
      };
    }

    try {
      let data: any = await pullUsers(params);
      results = [...results, ...data.Users];
      await getUsersRecurse(data.PaginationToken, 60);
    } catch (error) {
      console.log(error);
    }
  };

  await getUsersRecurse(token, limit);
  results = formatData(results);
  return results;
};

export const formatData = (data: any[]) => {
  let timeStamp = new Date();
  let fileArr = data.map((user) => {
    let attrs = {
      sub: flattenUser(user.Attributes, 'sub'),
      email_verified: flattenUser(user.Attributes, 'email_verified'),
      // fullName: flattenUser(user.Attributes, 'custom:fullName'),
      email: flattenUser(user.Attributes, 'email'),
    };

    return {
      userName: user.Username,
      userCreateDate: user.UserCreateDate.toISOString(),
      enabled: user.Enabled,
      userStatus: user.UserStatus,
      ...attrs,
    };
  });
  return JSON.parse(JSON.stringify(fileArr));
};

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

export const mapEnrollmentFields = (item: any) => {
  const {
    agencies: { transunion: transunion },
  } = item;
  // console.log('transunion ===> ', transunion);
  const { id, createdAt, status, statusReason, statusReasonDescription } = item;
  const {
    enrolled,
    enrolledOn,
    fulfilled,
    fulfilledOn,
    pinRequests,
    pinAttempts,
    pinCurrentAge,
    kbaAttempts,
    kbaCurrentAge,
    authAttempt,
  } = transunion;

  const createdDate = new Date(createdAt).toString() === 'Invalid Date' ? new Date(0).toISOString() : createdAt;
  const enrolledDate = new Date(enrolledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : enrolledOn;
  const fulfilledDate = new Date(fulfilledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : fulfilledOn;

  return {
    id,
    createdAt: createdDate,
    createdAtUTC: dayjs(createdDate).toISOString(),
    createdAtPST: dayjs(createdDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    sortKey: dayjs(createdDate).format('YYYY-MM-DD HH-mm-ss'),
    status,
    statusReason,
    statusReasonDescription,
    enrolled,
    enrolledOn: enrolledDate,
    enrolledOnUTC: dayjs(enrolledDate).toISOString(),
    enrolledOnPST: dayjs(enrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    fulfilled,
    fulfilledOn: fulfilledDate,
    fulfilledOnUTC: dayjs(fulfilledDate).toISOString(),
    fulfilledOnPST: dayjs(fulfilledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    pinRequests,
    pinAttempts,
    pinCurrentAge: pinCurrentAge ? dayjs(pinCurrentAge).tz().format('YYYY-MM-DD HH:mm:ss') : null,
    kbaAttempts,
    kbaCurrentAge: kbaCurrentAge ? dayjs(kbaCurrentAge).tz().format('YYYY-MM-DD HH:mm:ss') : null,
    authAttempt,
  };
};

export const mapFailedFulfilFields = (item: any) => {
  const {
    agencies: { transunion: transunion },
  } = item;
  // console.log('transunion ===> ', transunion);
  const { id, createdAt, status, statusReason, statusReasonDescription } = item;
  const { enrolled, enrolledOn, fulfilled, fulfilledOn } = transunion;

  const createdDate = new Date(createdAt).toString() === 'Invalid Date' ? new Date(0).toISOString() : createdAt;
  const enrolledDate = new Date(enrolledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : enrolledOn;
  const fulfilledDate = new Date(fulfilledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : fulfilledOn;

  return {
    id,
    createdAt: createdDate,
    createdAtUTC: dayjs(createdDate).toISOString(),
    createdAtPST: dayjs(createdDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    status,
    statusReason,
    statusReasonDescription,
    enrolled,
    enrolledOn: enrolledDate,
    enrolledOnUTC: dayjs(enrolledDate).toISOString(),
    enrolledOnPST: dayjs(enrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    fulfilled,
    fulfilledOn: fulfilledDate,
    fulfilledOnUTC: dayjs(fulfilledDate).toISOString(),
    fulfilledOnPST: dayjs(fulfilledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
  };
};

export const mapDisputeEnrollmentFields = (item: any) => {
  const {
    agencies: { transunion: transunion },
  } = item;
  // console.log('transunion ===> ', transunion);
  const { id, createdAt, status, statusReason, statusReasonDescription } = item;
  const { enrolled, enrolledOn, disputeEnrolled, disputeEnrolledOn } = transunion;

  const createdDate = new Date(createdAt).toString() === 'Invalid Date' ? new Date(0).toISOString() : createdAt;
  const enrolledDate = new Date(enrolledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : enrolledOn;
  const disputeEnrolledDate =
    new Date(disputeEnrolledOn).toString() === 'Invalid Date' ? new Date(0).toISOString() : disputeEnrolledOn;

  return {
    id,
    createdAt: createdDate,
    createdAtUTC: dayjs(createdDate).toISOString(),
    createdAtPST: dayjs(createdDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    status,
    statusReason,
    statusReasonDescription,
    enrolled,
    enrolledOn: enrolledDate,
    enrolledOnUTC: dayjs(enrolledDate).toISOString(),
    enrolledOnPST: dayjs(enrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    disputeEnrolled,
    disputeEnrolledOn: disputeEnrolledDate,
    disputeEnrolledOnUTC: dayjs(disputeEnrolledDate).toISOString(),
    disputeEnrolledOnPST: dayjs(disputeEnrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
  };
};

export const mapErrorFields = (item: {
  agencies?: any;
  id?: any;
  createdAt?: any;
  status?: any;
  statusReason?: any;
  statusReasonDescription?: any;
}) => {
  const {
    agencies: { transunion: transunion },
  } = item;
  // console.log('transunion ===> ', transunion);
  const { id, createdAt, status, statusReason, statusReasonDescription } = item;
  const {
    enrolled,
    enrolledOn,
    fulfilled,
    fulfilledOn,
    pinRequests,
    pinAttempts,
    pinCurrentAge,
    kbaAttempts,
    kbaCurrentAge,
    authAttempt,
    indicativeEnrichmentStatus,
    getAuthenticationQuestionsStatus,
    verifyAuthenticationQuestionsOTPStatus,
  } = transunion;

  const createdDate = new Date(createdAt).toString() === 'Invalid Date' ? 0 : createdAt;
  const enrolledDate = new Date(enrolledOn).toString() === 'Invalid Date' ? 0 : enrolledOn;
  const fulfilledDate = new Date(fulfilledOn).toString() === 'Invalid Date' ? 0 : fulfilledOn;

  return {
    id,
    createdAt: createdDate,
    createdAtUTC: dayjs(createdDate).toISOString(),
    createdAtPST: dayjs(createdDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    status,
    statusReason,
    statusReasonDescription,
    enrolled,
    enrolledOn: enrolledDate,
    enrolledOnUTC: dayjs(enrolledDate).toISOString(),
    enrolledOnPST: dayjs(enrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    fulfilled,
    fulfilledOn: fulfilledDate,
    fulfilledOnUTC: dayjs(fulfilledDate).toISOString(),
    fulfilledOnPST: dayjs(fulfilledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    pinRequests,
    pinAttempts,
    pinCurrentAge: pinCurrentAge ? new Date(pinCurrentAge).toLocaleString() : null,
    kbaAttempts,
    kbaCurrentAge: kbaCurrentAge ? new Date(kbaCurrentAge).toLocaleString() : null,
    authAttempt,
    'indicativeEnrichmentStatus:description': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.statusDescription
      : indicativeEnrichmentStatus,
    'indicativeEnrichmentStatus:status': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.status
      : indicativeEnrichmentStatus,
    'indicativeEnrichmentStatus:code': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.statusCode
      : indicativeEnrichmentStatus,
    'getAuthenticationQuestionsStatus:description': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.statusDescription
      : getAuthenticationQuestionsStatus,
    'getAuthenticationQuestionsStatus:status': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.status
      : getAuthenticationQuestionsStatus,
    'getAuthenticationQuestionsStatus:code': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.statusCode
      : getAuthenticationQuestionsStatus,
    'verifyAuthenticationQuestionsOTPStatus:description': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.statusDescription
      : verifyAuthenticationQuestionsOTPStatus,
    'verifyAuthenticationQuestionsOTPStatus:status': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.status
      : verifyAuthenticationQuestionsOTPStatus,
    'verifyAuthenticationQuestionsOTPStatus:code': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.statusCode
      : verifyAuthenticationQuestionsOTPStatus,
  };
};

export const mapRegistrationFields = (item: {
  userName: any;
  userCreateDate: any;
  enabled: any;
  userStatus: any;
  sub: any;
  email_verified: any;
  email: any;
}) => {
  const { userName, userCreateDate, enabled, userStatus, sub, email_verified, email } = item;

  return {
    userName,
    userCreateDate,
    userCreateDateUTC: dayjs(userCreateDate).toISOString(),
    userCreateDatePST: dayjs(userCreateDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    enabled,
    userStatus,
    sub,
    email_verified,
    email,
  };
};

export const mapSuspendedFields = (item: any) => {
  const {
    agencies: { transunion: transunion },
  } = item;
  // console.log('transunion ===> ', transunion);
  const { id, createdAt, status, statusReason, statusReasonDescription } = item;
  const {
    enrolled,
    enrolledOn,
    fulfilled,
    fulfilledOn,
    pinRequests,
    pinAttempts,
    pinCurrentAge,
    kbaAttempts,
    kbaCurrentAge,
    authAttempt,
    indicativeEnrichmentStatus,
    getAuthenticationQuestionsStatus,
    verifyAuthenticationQuestionsOTPStatus,
    verifyAuthenticationQuestionsKBAStatus,
  } = transunion;

  const createdDate = new Date(createdAt).toString() === 'Invalid Date' ? 0 : createdAt;
  const enrolledDate = new Date(enrolledOn).toString() === 'Invalid Date' ? 0 : enrolledOn;
  const fulfilledDate = new Date(fulfilledOn).toString() === 'Invalid Date' ? 0 : fulfilledOn;
  // Also add a formatted date for UTC yyyy-mm-dddd hh-mm-ss [TRAN-1698]
  return {
    id,
    createdAt: createdDate,
    createdAtUTC: new Date(createdDate).toISOString(),
    createdAtPST: dayjs(createdDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    sortKey: dayjs(createdDate).format('YYYY-MM-DD HH-mm-ss'),
    status,
    statusReason,
    statusReasonDescription,
    enrolled,
    enrolledOn: enrolledDate,
    enrolledOnUTC: new Date(enrolledDate).toISOString(),
    enrolledOnPST: dayjs(enrolledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    fulfilled,
    fulfilledOn: fulfilledDate,
    fulfilledOnUTC: new Date(fulfilledDate).toISOString(),
    fulfilledOnPST: dayjs(fulfilledDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    pinRequests,
    pinAttempts,
    pinCurrentAge: pinCurrentAge ? new Date(pinCurrentAge).toLocaleString() : null,
    kbaAttempts,
    kbaCurrentAge: kbaCurrentAge ? new Date(kbaCurrentAge).toLocaleString() : null,
    authAttempt,
    'indicativeEnrichmentStatus:description': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.statusDescription
      : indicativeEnrichmentStatus,
    'indicativeEnrichmentStatus:status': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.status
      : indicativeEnrichmentStatus,
    'indicativeEnrichmentStatus:code': indicativeEnrichmentStatus
      ? indicativeEnrichmentStatus.statusCode
      : indicativeEnrichmentStatus,
    'getAuthenticationQuestionsStatus:description': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.statusDescription
      : getAuthenticationQuestionsStatus,
    'getAuthenticationQuestionsStatus:status': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.status
      : getAuthenticationQuestionsStatus,
    'getAuthenticationQuestionsStatus:code': getAuthenticationQuestionsStatus
      ? getAuthenticationQuestionsStatus.statusCode
      : getAuthenticationQuestionsStatus,
    'verifyAuthenticationQuestionsOTPStatus:description': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.statusDescription
      : verifyAuthenticationQuestionsOTPStatus,
    'verifyAuthenticationQuestionsOTPStatus:status': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.status
      : verifyAuthenticationQuestionsOTPStatus,
    'verifyAuthenticationQuestionsOTPStatus:code': verifyAuthenticationQuestionsOTPStatus
      ? verifyAuthenticationQuestionsOTPStatus.statusCode
      : verifyAuthenticationQuestionsOTPStatus,
    'verifyAuthenticationQuestionsKBAStatus:description': verifyAuthenticationQuestionsKBAStatus
      ? verifyAuthenticationQuestionsKBAStatus.statusDescription
      : verifyAuthenticationQuestionsKBAStatus,
    'verifyAuthenticationQuestionsKBAStatus:status': verifyAuthenticationQuestionsKBAStatus
      ? verifyAuthenticationQuestionsKBAStatus.status
      : verifyAuthenticationQuestionsKBAStatus,
    'verifyAuthenticationQuestionsKBAStatus:code': verifyAuthenticationQuestionsKBAStatus
      ? verifyAuthenticationQuestionsKBAStatus.statusCode
      : verifyAuthenticationQuestionsKBAStatus,
  };
};
