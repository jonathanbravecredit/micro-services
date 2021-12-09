'use strict';
import * as vouchers from 'voucher-code-generator';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Referral, ReferralMaker } from 'lib/models/referral.model';
import { ICreateReferral } from 'lib/interfaces';
import { createReferral } from 'lib/queries';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: ICreateReferral = safeParse(event, 'body'); // referredByCode;
  const validate = ajv.getSchema<ICreateReferral>('referralCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const referralCode = vouchers.generate({ length: 7, count: 1 });
    const referral: Referral = new ReferralMaker(
      payload.id,
      referralCode[0],
      payload.campaign || '',
      payload.referredByCode,
    );
    await createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
