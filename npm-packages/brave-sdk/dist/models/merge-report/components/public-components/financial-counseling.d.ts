import { IFinancialCounseling } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class FinancialCounseling extends Homogenize<Partial<IFinancialCounseling>> implements IFinancialCounseling {
    amount: number | string | null;
    dateChecked: string | null;
    dateSettled: string | null;
    constructor(_data: Partial<IFinancialCounseling>);
}
