'use strict';
import 'reflect-metadata';
import * as vouchers from 'voucher-code-generator';
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
    const referralCode = vouchers.generate({ length: 7, count: 1 });
    const eligibility = await eligible(payload);
    const referral: Referral = new ReferralMaker(
      payload.id,
      referralCode[0],
      payload.campaign,
      false,
      payload.referredByCode,
    );
    await createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
