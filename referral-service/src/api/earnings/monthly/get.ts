'use strict';
import * as interfaces from 'lib/interfaces';
import * as queries from 'lib/queries';
import { response } from 'lib/utils/response';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ajv } from 'lib/schema/validation';
import { createBlankReferral, groupReferralsByYearMonth } from 'lib/utils/referrals/referral.utils';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string = event.requestContext.authorizer?.claims?.sub;
  const { month, year } = event.queryStringParameters as { month: string | undefined; year: string | undefined };

  const payload: interfaces.IGetEarningReferralMonthly = { id };
  const validate = ajv.getSchema<interfaces.IGetEarningReferralMonthly>('referralGet');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const referral = await queries.getReferral(id);
    const code = referral?.referralCode;
    if (!referral) {
      return response(404, null); // no referral code exists
    }
    if (!code) {
      const blank = createBlankReferral();
      return response(200, blank); // exists but no earnings
    }

    const query = queries.listEnrolledReferralsByReferredByMonthly;
    const allReferrals = await query(code, month, year);
    const grouped = groupReferralsByYearMonth(allReferrals);
    return response(200, grouped);
  } catch (err) {
    return response(500, err);
  }
};
