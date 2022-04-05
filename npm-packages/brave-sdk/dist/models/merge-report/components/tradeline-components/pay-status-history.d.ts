import { IMonthlyPayStatusItem, IPayStatusHistory } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PayStatusHistory extends Homogenize<Partial<IPayStatusHistory>> implements IPayStatusHistory {
    MonthlyPayStatus: IMonthlyPayStatusItem[];
    startDate: string | null;
    status: string | null;
    constructor(_data: Partial<IPayStatusHistory>);
    init(): void;
}
