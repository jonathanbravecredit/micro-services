import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WaitlistQueries } from "libs/queries/waitlist.queries";
import { response } from "libs/utils/response";
import { safeParse } from "libs/utils/safeJson";

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { email } = safeParse(event, "pathParameters") as { email: string };
  if (!email) return response(400, `Malformed request path parameter: ${email}`);
  try {
    const account = await WaitlistQueries.getWaitlistByEmail(email);
    return response(200, account);
  } catch (err) {
    console.error(err);
    return response(500, err);
  }
};
