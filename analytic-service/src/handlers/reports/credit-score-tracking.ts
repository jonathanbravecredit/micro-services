import 'reflect-metadata';
const csvjson = require('csvjson');
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';
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
    const hash: { [key: string]: boolean } = {}; // the first analytic click
    const actions = (await listAnalytics()).filter((a) => {
      if (!a.sub) return false;
      switch (a.event) {
        case 'dashboard_product':
          hash[a.sub] = true;
          return true;
        case 'creditmix_product_recommendation':
          hash[a.sub] = true;
          return true;
        case 'dispute_sucessfully_submited':
          hash[a.sub] = true;
          return true;
        case 'dispute_investigation_results':
          hash[a.sub] = true;
          return true;
        default:
          return false;
      }
    });

    const scores = (await listCreditScores())
      .filter((s) => hash[s.id])
      .sort((a, b) => new Date(a.createdOn || 0).valueOf() - new Date(b.createdOn || 0).valueOf());

    // uniform map the fields together.
    const scoresAndActions = [
      ...actions,
      ...scores.map((s) => {
        return {
          id: s.scoreId,
          event: 'score_update',
          sub: s.id,
          session: 'none',
          source: 'agency_service',
          value: s.score,
          createdOn: s.createdOn,
          modifiedOn: s.modifiedOn,
        };
      }),
    ];

    // now find the prior score and attach to the action.
    // create easy look up of scores

    // get all the analytics.
    // get the first click of investigate, or product click
    // then get the score history
    // filter by those that have clicked.
    // then filter through the credit scores and
    //  flag scores as prior to click
    //  mark the score at click (go through the clicks and match up the score)
    //  mark all the scores after as being after the event

    const scoreTracking = _.orderBy(scoresAndActions, ['sub', 'createdOn'], ['asc', 'asc']).map((a, i, arr) => {
      const changed = i > 0 ? arr[i - 1].sub !== a.sub : false;
      let score = -1;
      if (a.event === 'score_update') {
        score = a.value || -1;
      } else if (changed) {
        score = -1;
      } else if (i > 0) {
        score = arr[i - 1].value || -1;
      } else {
        score = -1;
      }

      return {
        ...a,
        trackedScore: score,
      };
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

    const mapped = scoreTracking.map((score, i, arr) => {
      if (!score) return;
      const haveSelfLoan = selfLoanUsers.get(score.id);
      return {
        ...score,
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
