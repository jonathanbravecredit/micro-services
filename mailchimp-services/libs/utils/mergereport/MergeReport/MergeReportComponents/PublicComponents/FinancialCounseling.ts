import { IFinancialCounseling } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class FinancialCounseling extends Homogenize<Partial<IFinancialCounseling>> implements IFinancialCounseling {
  amount: number | string | null = null;
  dateChecked: string | null = null;
  dateSettled: string | null = null;

  constructor(_data: Partial<IFinancialCounseling>) {
    super(_data);
    this.homogenize(_data);
  }
}
