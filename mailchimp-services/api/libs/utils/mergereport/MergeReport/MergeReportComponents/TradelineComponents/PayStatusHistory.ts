import { IMonthyPayStatusItem, IPayStatusHistory } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { MonthlyPayStatusItem } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/TradelineComponents/MonthlyPayStatusItem';

export class PayStatusHistory extends Homogenize<Partial<IPayStatusHistory>> implements IPayStatusHistory {
  MonthlyPayStatus: IMonthyPayStatusItem[] = [];
  startDate: string | null = null;
  status: string | null = null;

  constructor(_data: Partial<IPayStatusHistory>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.MonthlyPayStatus = this.homogenizeArray<IMonthyPayStatusItem, MonthlyPayStatusItem>(
      this.MonthlyPayStatus,
      MonthlyPayStatusItem,
    );
  }
}
