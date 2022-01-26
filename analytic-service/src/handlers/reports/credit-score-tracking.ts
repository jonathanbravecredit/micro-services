import 'reflect-metadata';
const csvjson = require('csvjson');
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { listAnalytics, listCreditScores } from 'lib/queries';
import { generateEmailParams } from 'lib/utils/helpers';
import { getItemsInDB } from 'lib/queries/appdata/appdata';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { UserSummary } from 'lib/utils/transunion/UserSummary';
import { getItemsInDisputeDB } from 'lib/queries/disputes/disputes.queries';

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
    _.orderBy(analytics, ['sub', 'createdOn'], ['asc', 'desc']).forEach((analytic) => {
      if (analytic.sub) {
        let dashboardProduct: string[] = hash[analytic.sub]?.dashboardProduct || [];
        let creditMixProduct: string[] = hash[analytic.sub]?.creditMixProduct || [];
        let disputeSubmitted: string[] = hash[analytic.sub]?.disputeSubmitted || [];
        let investigationResults: string[] = hash[analytic.sub]?.investigationResults || [];

        if (analytic.event === 'dashboard_product') dashboardProduct.push(analytic.createdOn!);
        if (analytic.event === 'creditmix_product_recommendation') creditMixProduct.push(analytic.createdOn!);
        if (analytic.event === 'dispute_sucessfully_submited') disputeSubmitted.push(analytic.createdOn!);
        if (analytic.event === 'dispute_investigation_results') investigationResults.push(analytic.createdOn!);

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

    // find anyone that has self
    const selfLoanUsers = new Map();
    await Promise.all(
      Object.keys(hash).map(async (sub) => {
        // look up the users credit score and
        const item = (await getItemsInDB(sub)) as unknown as UpdateAppDataInput;
        if (!item) return null;
        const tu = item.agencies?.transunion;
        if (!tu) return null;
        const disputed = (await getItemsInDisputeDB(item.id)) !== undefined;
        const record = new UserSummary(item.id, item.user?.userAttributes, tu, disputed);
        if (record.haveSelfLoans()) {
          selfLoanUsers.set(item.id, true);
        }
      }),
    );

    const scores = (await listCreditScores())
      .filter((s) => hash[s.id])
      .sort((a, b) => new Date(a.createdOn || 0).valueOf() - new Date(b.createdOn || 0).valueOf());
    const mapped = scores.map((score, i, arr) => {
      const analytics = hash[score.id];
      const haveSelfLoan = selfLoanUsers.get(score.id);
      const firstClick = new Date(analytics.firstClick);
      const createdOn = new Date(score.createdOn || 0);
      const nextCreatedOn = !arr[i + 1] ? new Date() : new Date(arr[i + 1].createdOn || new Date());

      const prior = i > 0 ? arr[i - 1] : null;
      const t1 = firstClick >= createdOn && firstClick < nextCreatedOn;
      const t2 = firstClick < createdOn && prior !== null && score.id !== prior.id;
      const nearestEvent = t1 ? analytics.firstClickEvent : t2 ? analytics.firstClickEvent : '';
      const nearestEventTime = t1 ? analytics.firstClick : t2 ? analytics.firstClick : '';
      //if the an analytic is greater than this score created on, but is less than the next score id

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

      return {
        ...score,
        nearestEvent,
        nearestEventTime,
        dashboardProductEvent,
        creditMixProductEvent,
        disputeSubmittedEvent,
        investigationResultsEvent,
        haveSelfLoan: haveSelfLoan || false,
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
