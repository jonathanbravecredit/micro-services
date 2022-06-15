import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { listUsersByEmail } from "lib/queries/cognito";
import { response } from "lib/utils/response";
import { safeParse } from "lib/utils/safeJson";

const USER_POOL_ID = process.env.POOL || "";

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { email } = safeParse(event, "pathParameters");
  if (!email) return response(400, `Malformed request path parameter: ${email}`);
  if (!USER_POOL_ID) return response(400, `Malformed request user pool id: ${USER_POOL_ID}`);
  try {
    const { Users: users } = await listUsersByEmail(USER_POOL_ID, email);
    return users.length ? response(200, "account_exists") : response(200, "account_not_found");
  } catch (err) {
    console.error(err);
    return response(500, err);
  }
};
