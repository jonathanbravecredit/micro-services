'use strict';
import 'reflect-metadata';
import * as vouchers from 'voucher-code-generator';
import * as uuid from 'uuid';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Referral, ReferralMaker } from 'lib/models/referral.model';
import { ICreateReferral } from 'lib/interfaces';
import { createReferral } from 'lib/queries';
import { eligible } from 'lib/utils/campaigns/campaignEligibilityLogic';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body: { id: string; referredByCode?: string } = safeParse(event, 'body'); // referredByCode;
  const payload: ICreateReferral = { ...body, campaign: CURRENT_CAMPAIGN };
  const validate = ajv.getSchema<ICreateReferral>('referralCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    // determine eligibility
    const approved = await eligible(payload);
    // if (approved) {
    //   const { referralCode } = referralUser;
    //   const referral = new ReferralMaker(
    //     payload.id,
    //     referrealUser
    //     payload.campaign,
    //     false,
    //     payload.referredByCode,
    //   );

    // }
  } catch (err) {
    return response(500, err);
  }

  try {
    // await createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
