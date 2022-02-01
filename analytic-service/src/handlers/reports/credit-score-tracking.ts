import 'reflect-metadata';
const csvjson = require('csvjson');
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import { SES, DynamoDB } from 'aws-sdk';
import { listAnalytics, listCreditScores } from 'lib/queries';
import { generateEmailParams } from 'lib/utils/helpers';
import { getItemsInDB } from 'lib/queries/appdata/appdata';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { UserSummary } from 'lib/utils/transunion/UserSummary';
import { getItemsInDisputeDB } from 'lib/queries/disputes/disputes.queries';
import { Analytics } from 'lib/models/analytics.model';
import { CreditScore } from 'lib/models/credit-scores.model';
import { IScores } from 'lib/interfaces/api/creditscoretracking/creditscoretracking.interface';

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
    // get a list of actions, scores, and create a list of unique user ids with actions
    const actions = (await listAnalytics()).filter(filterAnalytics);
    const hash = new Map(actions.map((a) => [a.sub, true]));
    const scores = (await listCreditScores()).filter((s) => hash.get(s.id)).sort(sortCreditScore);
    // uniform map the fields together.
    const scoresAndActions = [...actions, ...scores.map(mapScores)];
    // cascade down the score until it changes
    let trackedScore = -1;
    const scoreTracking = _.orderBy(scoresAndActions, ['sub', 'createdOn'], ['asc', 'asc']).map((a, i, arr) => {
      const changed = i > 0 ? arr[i - 1].sub !== a.sub : false;
      if (a.event === 'score_update') {
        trackedScore = a.value || -1;
      } else if (changed) {
        trackedScore = -1;
      }
      return {
        ...a,
        trackedScore,
      };
    });

    console.log('hash', hash);
    console.log('scoreTracking', scoreTracking);

    // find anyone that has self
    const selfLoanUsers = new Map();
    await Promise.all(
      [...hash].map(async (sub, i) => {
        // look up the users credit score and
        if (i < 4) console.log('sub ==> ', sub);
        try {
          const item = await getItemsInDB(sub);
          if (i < 4) console.log('item ===> ', JSON.stringify(item));
          const data = DynamoDB.Converter.unmarshall(item) as unknown as UpdateAppDataInput;
          if (i < 4) console.log('data ===> ', JSON.stringify(data));
          if (!data) return null;
          const tu = data.agencies?.transunion;
          if (!tu) return null;
          const disputed = (await getItemsInDisputeDB(data.id)) !== undefined;
          const record = new UserSummary(data.id, data.user?.userAttributes, tu, disputed);
          if (record.haveSelfLoans()) {
            selfLoanUsers.set(data.id, true);
          }
          return null;
        } catch (err) {
          console.log(err);
          return null;
        }
      }),
    );
    // map if the user has a self loan by looking up the sub
    const mapped = scoreTracking.map((score) => {
      if (!score) return;
      const haveSelfLoan = selfLoanUsers.get(score.sub);
      return {
        ...score,
        haveSelfLoan: haveSelfLoan || false,
      };
    });
    // generate the csv files and email them out
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

export const filterAnalytics = (a: Analytics) => {
  if (!a.sub) return false;
  switch (a.event) {
    case 'user_log_in':
      return false;
    default:
      return true;
  }
};

export const sortCreditScore = (a: CreditScore, b: CreditScore) => {
  const aDate = new Date(a.createdOn || 0).valueOf();
  const bDate = new Date(b.createdOn || 0).valueOf();
  return aDate - bDate;
};

export const mapScores = (score: CreditScore): IScores => {
  return {
    id: score.scoreId,
    event: 'score_update',
    sub: score.id,
    session: 'none',
    source: 'agency_service',
    value: score.score,
    createdOn: score.createdOn,
    modifiedOn: score.modifiedOn,
  };
};
