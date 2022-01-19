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
import { createReferralUser, getReferralUser } from 'lib/queries/referralUsers/referral-users.queries';
import { ReferralUserMaker } from 'lib/models/referral-users.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body: { id: string; referredByCode?: string } = safeParse(event, 'body'); // referredByCode;
  const payload: ICreateReferral = { ...body, campaign: CURRENT_CAMPAIGN };
  const validate = ajv.getSchema<ICreateReferral>('referralCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    // if a user does not have a record in the referral user table create one
    //  - create a generic user who is not in any active campaign;
    //  - ?? how to enroll them in an active campaign;
    //  -    or would there always be an active campaign at this point.
    //  -    I think this shold be decoupled and the campaign activation should be separate
    let referralUser = await getReferralUser(payload.id);
    if (referralUser === null) {
      const referralCode = uuid.v4();
      const made = new ReferralUserMaker(payload.id, referralCode);
      await createReferralUser(made);
      referralUser = made;
    };

    // determine eligibility
    const approved = await eligible(payload);
    if (approved) {
      const { referralCode } = referralUser;
      const referral = new ReferralMaker(
        payload.id,
        referrealUser
        payload.campaign,
        false,
        payload.referredByCode,
      );

    }

  } catch (err) {
    return response(500, err);
  };

  try {
    await createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
