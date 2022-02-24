import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IIpStackResponse } from 'lib/interfaces/ipstack.interfaces';
import { response } from 'lib/utils/response';
const axios = require('axios').default;

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  // const { email } = safeParse(event, 'queryStringParameters');
  const ipaddress = event.requestContext.identity.sourceIp;
  console.log('ipaddress ===> ', ipaddress);
  if (!ipaddress) return response(200, { status: 'error', result: '' });

  const url = `https://api.ipstack.com/${ipaddress}?access_key=494f2a0ccd886092dbfcad96d213bce8`;
  try {
    const { data } = await axios.get(url);
    const geolocation: IIpStackResponse = data;
    console.log('resp ===> ', geolocation);
    const result =
      geolocation.country_code === 'US'
        ? { success: true, result: 'US country code' }
        : { success: false, result: 'non-US country code' };
    return response(200, result);
  } catch (err) {
    return response(200, { success: false, result: err });
  }
};
