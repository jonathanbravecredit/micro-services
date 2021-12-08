import { Referral } from "lib/models/referral.model";
import * as moment from "moment";
import { IPayments } from "src/api/referrals/campaign/payments/payments.interfaces";

const dec2020PaymentLogic = (allReferrals: Referral[]) => {
  let paymentScheduledDate;
  let paymentsProcessed = 0;
  let paymentsPending = 0;

  allReferrals.forEach((referral) => {
    referral.processingStatus === "paid"
      ? (paymentsProcessed += 1)
      : (paymentsPending += 1);
  });

  const sortedReferralsByDate = allReferrals.sort((a, b): number => {
    let aCreatedOn: number = new Date(a.createdOn || 0).valueOf();
    let bCreatedOn: number = new Date(b.createdOn || 0).valueOf();

    return aCreatedOn - bCreatedOn;
  });

  if (allReferrals.length >= 10) {
    let tenthReferralDate = sortedReferralsByDate[9].createdOn;

    paymentScheduledDate = moment(tenthReferralDate)
      .add(1, "week")
      .isoWeekday(2);
  } else {
    let latestReferralDate =
      sortedReferralsByDate[sortedReferralsByDate.length - 1].createdOn;

    paymentScheduledDate = moment(latestReferralDate)
      .add(1, "month")
      .startOf("month")
      .add(6 - moment().day("Tuesday").day(), "days")
      .startOf("week")
      .day(2)
      .toISOString();
  }

  return { paymentsPending, paymentsProcessed, paymentScheduledDate };
};

export const campaignPaymentLogic: {
  [key: string]: (allReferrals: Referral[]) => IPayments;
} = {
  dec2020: dec2020PaymentLogic,
};
