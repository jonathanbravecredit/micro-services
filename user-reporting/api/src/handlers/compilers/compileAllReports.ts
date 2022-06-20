import "reflect-metadata";
const csvjson = require("csvjson");
import dayjs from "dayjs";
import * as nodemailer from "nodemailer";
import { SES } from "aws-sdk";
import { Handler } from "aws-lambda";
import { generateEmailParams } from "libs/helpers";
import { ReportNames } from "libs/data/reports";
import { OpsReportQueries } from "@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries";

// request.debug = true; import * as request from 'request';
const ses = new SES({ region: "us-east-1" });
const STAGE = process.env.STAGE;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  const { batch } = event;
  const batchId = batch ? batch : dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
  try {
    await Promise.all(
      Object.values(ReportNames).map(async (reportId) => {
        const opsreports = await OpsReportQueries.listOpsReportsByBatch(batchId, reportId);
        if (!opsreports?.length) return;
        console.log(`grabbed ${opsreports.length} records`);
        const reportData = opsreports.map((report, i) => {
          if (i < 2) console.log("DB record ==> ", report);
          const data = JSON.parse(report.record);
          return data;
        });
        // send an email letting me know which segment is done
        const content = csvjson.toCSV(JSON.stringify(reportData), { headers: "key" });
        const emails =
          STAGE === "dev"
            ? ["jonathan@brave.credit"]
            : ["jonathan@brave.credit", "jorge@brave.credit", "noah@brave.credit"];
        let params = generateEmailParams(`Report: ${reportId}`, emails);
        const filename = `${reportId}-${batchId}.csv`;
        params.attachments = [{ filename, content }];
        let transporter = nodemailer.createTransport({ SES: ses });
        await transporter.sendMail(params);
        return;
      }),
    );
  } catch (err) {
    console.log("general err ===> ", err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
