"use strict";
import "reflect-metadata";
import * as interfaces from "lib/interfaces";
import * as vouchers from "voucher-code-generator";
import { ajv } from "lib/schema/validation";
import { response } from "lib/utils/response";
import {
  getReferral,
  getAllEnrolledReferralsByCampaign,
  createReferral,
} from "lib/queries";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createBlankMonthlyReferral } from "lib/utils/referrals/referral.utils";
import { campaignPaymentLogic } from "lib/utils/payments/campaignPaymentLogic";
import { CURRENT_CAMPAIGN } from "lib/data/campaign";
import { ReferralMaker } from "lib/models/referral.model";

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { campaign } = event.queryStringParameters as {
    campaign: string;
  };

  const payload: interfaces.IGetReferralByCampaign = {
    id,
    campaign,
  };
  const validate = ajv.getSchema<interfaces.IGetReferralByCampaign>(
    "referralCampaignEarningsMonthlyGet"
  );
  if (!validate || !validate(payload))
    throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const { campaign } = payload;
    const referral = await getReferral(payload.id);
    const code = referral?.referralCode;
    if (!referral) {
      const campaign = CURRENT_CAMPAIGN;
      const referralCode = vouchers.generate({ length: 7, count: 1 })[0];
      const newReferral = new ReferralMaker(id, referralCode, campaign);
      newReferral.updateReferralEnrollment("enrolled"); // can only be enrolled when they get here
      await createReferral(newReferral);
      const now = new Date();
      const blank = createBlankMonthlyReferral();
      return response(200, blank); // exists but no earnings
    }

    if (!code || referral.status === "suspended") {
      const blank = createBlankMonthlyReferral();
      return response(200, blank); // exists but no earnings
    }

    console.log("payload ===> ", payload);

    const allReferrals = await getAllEnrolledReferralsByCampaign(
      code,
      campaign
    );
    const { paymentsProcessed, paymentsPending, paymentScheduledDate } =
      campaignPaymentLogic[campaign](allReferrals);

    return response(200, {
      paymentsProcessed,
      paymentsPending,
      paymentScheduledDate,
    });
  } catch (err) {
    return response(500, err);
  }
};
