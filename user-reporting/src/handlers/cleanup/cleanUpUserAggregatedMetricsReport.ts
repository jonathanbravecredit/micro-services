import 'reflect-metadata';
import * as dayjs from 'dayjs';
import { Handler } from 'aws-lambda';
import { batchDeleteOpsReport, listOpsReportsByBatch } from 'libs/queries/ops-report.queries';
import { ReportNames } from 'libs/data/reports';

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  const { batch } = event;
  const batchId = batch ? batch : dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
  try {
    const reportId = ReportNames.UserAggregatedMetrics;
    const opsreports = await listOpsReportsByBatch(batchId, reportId);
    if (!opsreports?.length) return;
    let queue = opsreports;
    while (queue.length) {
      const next = queue.splice(0, 24);
      await batchDeleteOpsReport(next);
    }
    return;
  } catch (err) {
    console.log('general err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
