/*====================================*/
/* !!Important!!                      */
/* - Keep all spelling mistakes as is */

import { MergeReport } from '../models/merge-report';

/*====================================*/
export interface IMergeReport extends MergeReport {}

/*==========================*/
/*     non-schema related   */
/*==========================*/
export interface IUnparsedCreditReport {
  '#text': string | null;
  type: string | null;
}
