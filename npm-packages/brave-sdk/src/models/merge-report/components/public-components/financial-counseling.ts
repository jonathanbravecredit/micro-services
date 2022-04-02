import { IFinancialCounseling } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class FinancialCounseling extends Homogenize<Partial<IFinancialCounseling>> implements IFinancialCounseling {
  amount: number | string | null = null;
  dateChecked: string | null = null;
  dateSettled: string | null = null;

  constructor(_data: Partial<IFinancialCounseling>) {
    super(_data);
    this.homogenize(_data);
  }
}
