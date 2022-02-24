import { SES } from 'aws-sdk';
import { getUsers, generateEmailParams } from 'libs/helpers';
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';

const ses = new SES({ region: 'us-east-1' });

var limit = 60;
var paginationToken = '';

export const main = async () => {
  // Call function to pull data and write it to file
  let cutOff = new Date();
  cutOff.setHours(cutOff.getHours() - 24);
  try {
    // let priorData = await getItemsInDB('prodPoolReport', tableName);
    let allUsers = await getUsers(paginationToken, limit);
    let newUsers = allUsers.filter((item) => {
      return new Date(item.userCreateDate) >= cutOff;
    });
    // console.log('new data', JSON.stringify(newUsers));
    // console.log('all data', JSON.stringify(allUsers));
    console.log('new data', newUsers.length);
    console.log('all data', allUsers.length);
    const csvAllData = csvjson.toCSV(JSON.stringify(allUsers), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newUsers), {
      headers: 'key',
    });
    console.log('csv buffer ', csvAllData);
    let params = generateEmailParams('Your disable user reports');

    params.attachments = [
      {
        filename: 'prodPoolReportAllUsers.csv',
        content: csvAllData,
      },
      {
        filename: 'prodPoolReportNewUsers.csv',
        content: csvNewData,
      },
    ];
    let transporter = nodemailer.createTransport({
      SES: ses,
    });

    const info = await transporter.sendMail(params);
    console.log('info --> ', info);
  } catch (error) {
    console.log(error);
  }
};
