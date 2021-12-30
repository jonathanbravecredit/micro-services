import 'reflect-metadata';
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { listAnalytics, listCreditScores } from 'lib/queries';
import { generateEmailParams } from 'lib/utils/helpers';
import * as _ from 'lodash';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;
interface IHashData {
  firstClick: string;
  firstClickEvent: string;
  dashboardProduct: string[];
  creditMixProduct: string[];
  disputeSubmitted: string[];
  investigationResults: string[];
}

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
    const hash: { [key: string]: IHashData } = {}; // the first analytic click
    _.orderBy(analytics, ['sub', 'createdOn'], ['asc', 'desc']).forEach((analytic, i, arr) => {
      if (analytic.sub) {
        const dashboardProduct = hash[analytic.sub] ? hash[analytic.sub].dashboardProduct || [] : [];
        const creditMixProduct = hash[analytic.sub] ? hash[analytic.sub].creditMixProduct || [] : [];
        const disputeSubmitted = hash[analytic.sub] ? hash[analytic.sub].disputeSubmitted || [] : [];
        const investigationResults = hash[analytic.sub] ? hash[analytic.sub].investigationResults || [] : [];

        if (analytic.event === 'dashboard_product' && hash[analytic.sub]) dashboardProduct.push(analytic.createdOn!);
        if (analytic.event === 'creditmix_product_recommendation' && hash[analytic.sub])
          creditMixProduct.push(analytic.createdOn!);
        if (analytic.event === 'dispute_sucessfully_submited' && hash[analytic.sub])
          disputeSubmitted.push(analytic.createdOn!);
        if (analytic.event === 'dispute_investigation_results' && hash[analytic.sub])
          investigationResults.push(analytic.createdOn!);

        const data = {
          ...hash[analytic.sub],
          firstClick: analytic.createdOn!,
          firstClickEvent: analytic.event,
          dashboardProduct,
          creditMixProduct,
          disputeSubmitted,
          investigationResults,
        };
        hash[analytic.sub] = data;
      }
    });

    const scores = (await listCreditScores())
      .filter((s) => hash[s.id])
      .sort((a, b) => new Date(a.createdOn || 0).valueOf() - new Date(b.createdOn || 0).valueOf());
    const mapped = scores.map((score, i, arr) => {
      const analytics = hash[score.id];
      const firstClick = new Date(analytics.firstClick);
      const createdOn = new Date(score.createdOn || 0);
      const nextCreatedOn = arr[i + 1] ? new Date() : new Date(arr[i + 1].createdOn || new Date());
      const t1 = firstClick >= createdOn && firstClick < nextCreatedOn;
      const nearestEvent = t1 ? analytics.firstClickEvent : '';
      const nearestEventTime = t1 ? analytics.firstClick : '';
      const dashboardProductEvent = analytics.dashboardProduct.find((event: string) => {
        const dte = new Date(event);
        return dte >= createdOn && dte < nextCreatedOn;
      });
      const creditMixProductEvent = analytics.creditMixProduct.find((event: string) => {
        const dte = new Date(event);
        return dte >= createdOn && dte < nextCreatedOn;
      });
      const disputeSubmittedEvent = analytics.disputeSubmitted.find((event: string) => {
        const dte = new Date(event);
        return dte >= createdOn && dte < nextCreatedOn;
      });
      const investigationResultsEvent = analytics.investigationResults.find((event: string) => {
        const dte = new Date(event);
        return dte >= createdOn && dte < nextCreatedOn;
      });
      //if the an analytic is greater than this score created on, but is less than the next score id
      return {
        ...score,
        nearestEvent,
        nearestEventTime,
        dashboardProductEvent,
        creditMixProductEvent,
        disputeSubmittedEvent,
        investigationResultsEvent,
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
