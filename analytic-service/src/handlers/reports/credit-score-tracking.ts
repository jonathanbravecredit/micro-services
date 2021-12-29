import 'reflect-metadata';
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { listAnalytics, listCreditScores } from 'lib/queries';
import { generateEmailParams } from 'lib/utils/helpers';
import * as _ from 'lodash';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const analytics = await listAnalytics();
    // get all the analytics.
    // get the first click of investigate, or product click
    // then get the score history
    // filter by those that have clicked.
    // then filter through the credit scores and
    //  flag scores as prior to click
    //  mark the score at click (go through the clicks and match up the score)
    //  mark all the scores after as being after the event
    const hash: Record<string, any> = {}; // the first analytic click
    _.orderBy(analytics, ['sub', 'createdOn'], ['asc', 'desc']).forEach((a) => {
      if (a.sub) {
        const event = a.event;
        const key = `${a.event}`;
        const data = {
          ...hash[a.sub],
          firstClick: a.createdOn!,
          firsClickEvent: a.event,
        };
        data[key] = event;
        hash[a.sub] = data;
      }
    });

    const scores = (await listCreditScores())
      .filter((s) => hash[s.id])
      .sort((a, b) => new Date(a.createdOn || 0).valueOf() - new Date(b.createdOn || 0).valueOf());
    const mapped = scores.map((s) => {
      const analytics = hash[s.id];
      const initiated = (s.createdOn || 0) > analytics.firstClick;
      const initiatingEvent = initiated ? analytics.firstClickEvent : '';
      const initiatingEventTime = initiated ? analytics.firstClick : '';
      return {
        ...s,
        initiatingEvent,
        initiatingEventTime,
      };
    });
    const csvAnalytics = csvjson.toCSV(JSON.stringify(mapped), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your analytics report', emails);

    params.attachments = [
      {
        filename: 'credit-score-tracking.csv',
        content: csvAnalytics,
      },
    ];
    let transporter = nodemailer.createTransport({
      SES: ses,
    });
    const info = await transporter.sendMail(params);
    console.log('info --> ', info);
  } catch (err) {
    console.log(err);
  }
};
