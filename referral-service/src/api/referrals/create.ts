'use strict';
import * as vouchers from 'voucher-code-generator';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { ajv } from 'lib/schema/validation';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { safeParse } from 'lib/utils/safeJson';
import { Referral, ReferralMaker } from 'lib/models/referral.model';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body: any = safeParse(event, 'body'); // referredByCode;
  const id = 'jpizzolato36@gmail.com'; //body.id;
  console.log('body ==> ', body);
  const payload: interfaces.ICreateReferral = {
    id,
    ...JSON.parse(body),
  };
  const validate = ajv.getSchema<interfaces.ICreateReferral>('referralCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  try {
    const referralCode = vouchers.generate({ length: 7, count: 1 });
    const referral: Referral = new ReferralMaker(payload.id, referralCode[0], payload.referredByCode);
    await queries.createReferral(referral);
    return response(200, `success`);
  } catch (err) {
    return response(500, err);
  }
};
