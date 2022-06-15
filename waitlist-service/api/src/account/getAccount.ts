import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { response } from "libs/utils/response";

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // parse the object from the body
  // validate the schema from it
  // get the account using the id
  return response(200, null);
};
