import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class FinancialCounseling extends Homogenize<Partial<FinancialCounseling>> {
  amount: number | string | null = null;
  dateChecked: string | null = null;
  dateSettled: string | null = null;

  constructor(_data: Partial<FinancialCounseling>) {
    super(_data);
    this.homogenize(_data);
  }
}
