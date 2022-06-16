import { WaitlistMaker } from "@bravecredit/brave-sdk/dist/models/waitlist/waitlist";
import { WaitlistQueries } from "@bravecredit/brave-sdk/dist/utils/dynamodb/queries/waitlist.queries";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PostAccount } from "libs/interfaces/postAccount.interface";
import { listUsersByEmail } from "libs/queries/cognito";
import { response } from "libs/utils/response";
import { safeParse } from "libs/utils/safeJson";

const USER_POOL_ID = process.env.POOL || "";

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { firstName, lastName, email, phone, referredByCode } = safeParse(event, "body") as PostAccount;
  if (!firstName) return response(400, `Malformed body; missing firstName: ${firstName}`);
  if (!lastName) return response(400, `Malformed body; missing lastName: ${lastName}`);
  if (!email) return response(400, `Malformed body; missing email: ${email}`);
  if (!phone) return response(400, `Malformed body; missing phone: ${phone}`);
  if (!USER_POOL_ID) response(400, `Malformed request user pool id: ${USER_POOL_ID}`);
  try {
    // get the id from cognito
    const { Users: users } = await listUsersByEmail(USER_POOL_ID, email);
    const user = users?.pop();
    if (!user) return response(400, `Request reject; could not locate user account`);
    const { Username: id } = user;
    if (!id) return response(400, `Request reject; could not locate user account`);
    const waitlist = new WaitlistMaker(id, firstName, lastName, email, phone, referredByCode);
    const account = await WaitlistQueries.createWaitlist(waitlist);
    return response(200, account);
  } catch (err) {
    console.error(err);
    return response(500, err);
  }
};
