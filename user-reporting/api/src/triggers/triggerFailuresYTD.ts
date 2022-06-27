import "reflect-metadata";
import { Handler } from "aws-lambda";
import { triggerReport } from './triggerUtility';
import { ReportNames } from "libs/data/reports";

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  return triggerReport(event, ReportNames.FailureReport, 20, process.env.STAGE);
};
