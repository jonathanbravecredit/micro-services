import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { MonthlyPayStatusItem } from './monthly-pay-status-item';

export class PayStatusHistory extends Homogenize<Partial<PayStatusHistory>> {
  MonthlyPayStatus: MonthlyPayStatusItem[] = [];
  startDate: string | null = null;
  status: string | null = null;

  constructor(_data: Partial<PayStatusHistory>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.MonthlyPayStatus = this.homogenizeArray<MonthlyPayStatusItem, MonthlyPayStatusItem>(
      this.MonthlyPayStatus,
      MonthlyPayStatusItem,
    );
  }
}
