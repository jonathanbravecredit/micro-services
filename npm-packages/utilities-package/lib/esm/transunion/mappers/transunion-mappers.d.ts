import { IBorrower, IPublicPartition, ITradeLinePartition } from '@shared/interfaces';
import { IDisputePublicItem } from '@shared/interfaces/dispute.interfaces';
import { TransunionBase } from '@shared/utils/transunion/transunion-base';
import { ICreditReportCardInputs } from '@shared/components/cards/credit-report-card/credit-report-card.component';
import { IPersonalItemsDetailsTable } from '@views/dashboard/reports/credit-report/personalitems/components/personalitems-details/interfaces';
import { IDisputeCurrent, IDisputeHistorical } from '@views/dashboard/disputes/components/cards/interfaces';
import { IProcessDisputeTradelineResult } from '@views/dashboard/disputes/disputes-tradeline/disputes-tradeline-pure/disputes-tradeline-pure.view';
import { IProcessDisputePersonalResult } from '@views/dashboard/disputes/disputes-personal/disputes-personal-pure/disputes-personal-pure.view';
import { IProcessDisputePublicResult } from '@views/dashboard/disputes/disputes-public/disputes-public-pure/disputes-public-pure.view';
import { IDispute } from '@shared/interfaces/disputes';
export declare const TUStatusMapping: Record<string, any>;
export declare class TransunionMappers extends TransunionBase {
    static parser: any;
    static query: any;
    constructor();
    static mapBorrowerToDetails(borrower: IBorrower): IPersonalItemsDetailsTable;
    static mapPublicItemToDispute(item: IPublicPartition): IDisputePublicItem;
    /**
     * Map the tradeline object to the negative account object
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static mapTradelineToSummaryCard(tradeLines: ITradeLinePartition[]): ICreditReportCardInputs[];
    /**
     * Helper function to get the label and value for the first fields
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    private static getFirstFields;
    /**
     * Helper function to get the label and value for the second fields
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    private static getSecondFields;
    static mapTradelineDispute(item: IProcessDisputeTradelineResult | undefined | null, dispute: IDispute | undefined | null): IDisputeCurrent;
    static mapHistoricalTradelineDispute(item: IProcessDisputeTradelineResult | undefined | null, dispute: IDispute | undefined | null): IDisputeHistorical;
    static mapPersonalDispute(item: IProcessDisputePersonalResult | undefined | null, dispute: IDispute | undefined | null): IDisputeCurrent;
    static mapHistoricalPersonalDispute(item: IProcessDisputePersonalResult | undefined | null, dispute: IDispute | undefined | null): IDisputeHistorical;
    static mapPublicDispute(item: IProcessDisputePublicResult | undefined | null, dispute: IDispute | undefined | null): IDisputeCurrent;
    static mapHistoricalPublicDispute(item: IProcessDisputePublicResult | undefined | null, dispute: IDispute | undefined | null): IDisputeHistorical;
}
