import { IMonthlyPayStatusItem, IPayStatusHistory } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { MonthlyPayStatusItem } from './monthly-pay-status-item';

export class PayStatusHistory extends Homogenize<Partial<IPayStatusHistory>> implements IPayStatusHistory {
  MonthlyPayStatus: IMonthlyPayStatusItem[] = [];
  startDate: string | null = null;
  status: string | null = null;

  constructor(_data: Partial<IPayStatusHistory>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.MonthlyPayStatus = this.homogenizeArray<IMonthlyPayStatusItem, MonthlyPayStatusItem>(
      this.MonthlyPayStatus,
      MonthlyPayStatusItem,
    );
  }
}
