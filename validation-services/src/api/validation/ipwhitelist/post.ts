import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IIpStackError, IIpStackResponse } from 'lib/interfaces/ipstack.interfaces';
import { response } from 'lib/utils/response';
import { SES } from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import { generateEmailParams } from 'lib/utils/helpers';

const axios = require('axios').default;
const ses = new SES({ region: 'us-east-1' });
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
    const { code } = err as IIpStackError;
    if (err.code === 104) {
      let params = generateEmailParams(`!!!! IPADDRESS AT QUOTA !!!!`, ['jonathan@brave.credit']);
      let transporter = nodemailer.createTransport({ SES: ses });
      try {
        await transporter.sendMail(params);
        return response(200, { success: true, result: err.info });
      } catch {
        return response(200, { success: true, result: err.info });
      }
    }
    return response(200, { success: false, result: err });
  }
};
