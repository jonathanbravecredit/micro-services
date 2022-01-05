import { Referral } from 'lib/models/referral.model';
import * as moment from 'moment';
import { IPayments } from 'lib/interfaces/api/referrals/payments/payments.interfaces';
import { CURRENT_CAMPAIGN_START_DATE } from 'lib/data/campaign';

const dec2020PaymentLogic = (allReferrals: Referral[], referral: Referral, currentCampaign: string) => {
  let paymentScheduledDate;
  let paymentsProcessed = 0;
  let paymentsPending = 0;

  allReferrals.forEach((referral) => {
    referral.processingStatus === 'paid' ? (paymentsProcessed += 1) : (paymentsPending += 1);
  });

  const sortedReferralsByDate = allReferrals.sort((a, b): number => {
    let aCreatedOn: number = new Date(a.createdOn || 0).valueOf();
    let bCreatedOn: number = new Date(b.createdOn || 0).valueOf();

    return aCreatedOn - bCreatedOn;
  });

  if (allReferrals.length >= 10) {
    let tenthReferralDate = sortedReferralsByDate[9].createdOn;

    if (moment(tenthReferralDate).day() === 0) {
      paymentScheduledDate = moment(tenthReferralDate).day(2).toISOString();
    }

    paymentScheduledDate = moment(tenthReferralDate).add(1, 'week').day(2).toISOString();
  } else {
    const createdOn = sortedReferralsByDate[sortedReferralsByDate.length - 1]?.createdOn;
    let latestReferralDate = createdOn ? createdOn : new Date().toISOString();

    paymentScheduledDate = moment(latestReferralDate)
      .add(1, 'month')
      .startOf('month')
      .add(6 - moment().day('Tuesday').day(), 'days')
      .startOf('week')
      .day(2)
      .toISOString();
  }

  return { paymentsPending, paymentsProcessed, paymentScheduledDate, currency: '', earningsAmount: 0 };
};

const jan2020PaymentLogic = (allReferrals: Referral[], referral: Referral, currentCampaign: string) => {
  let paymentScheduledDate;
  let paymentsProcessed = 0;
  let paymentsPending = 0;
  let earningsAmount = 0;
  let currency = 'USD';

  allReferrals.forEach((referral) => {
    referral.processingStatus === 'paid' ? (paymentsProcessed += 1) : (paymentsPending += 1);
  });

  const sortedReferralsByDate = allReferrals.sort((a, b): number => {
    let aCreatedOn: number = new Date(a.createdOn || 0).valueOf();
    let bCreatedOn: number = new Date(b.createdOn || 0).valueOf();

    return aCreatedOn - bCreatedOn;
  });

  if (allReferrals.length >= 10) {
    let tenthReferralDate = sortedReferralsByDate[9].createdOn;

    if (moment(tenthReferralDate).day() === 0) {
      paymentScheduledDate = moment(tenthReferralDate).day(2).toISOString();
    }

    paymentScheduledDate = moment(tenthReferralDate).add(1, 'week').day(2).toISOString();

    earningsAmount = 30;
  } else {
    const createdOn = sortedReferralsByDate[sortedReferralsByDate.length - 1]?.createdOn;
    let latestReferralDate = createdOn ? createdOn : new Date().toISOString();

    paymentScheduledDate = moment(latestReferralDate)
      .add(1, 'month')
      .startOf('month')
      .add(6 - moment().day('Tuesday').day(), 'days')
      .startOf('week')
      .day(2)
      .toISOString();

    earningsAmount = allReferrals.length * 3;
  }

  if (allReferrals.length >= 5) {
    earningsAmount += 5;
  }

  if (referral.enrollmentStatus === 'enrolled' && moment(referral.createdOn).isAfter(CURRENT_CAMPAIGN_START_DATE)) {
    earningsAmount += 3;
  }

  return { paymentsPending, paymentsProcessed, paymentScheduledDate, currency, earningsAmount };
};

export const campaignPaymentLogic: {
  [key: string]: (allReferrals: Referral[], referral: Referral, currentCampaign: string) => IPayments;
} = {
  dec2020: dec2020PaymentLogic,
  jan2022: jan2020PaymentLogic,
};
