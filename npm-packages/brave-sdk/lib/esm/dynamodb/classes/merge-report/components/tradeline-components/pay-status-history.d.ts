import { IPayStatusHistory, IMonthyPayStatusItem } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class PayStatusHistory extends Homogenize<Partial<IPayStatusHistory>> implements IPayStatusHistory {
    MonthlyPayStatus: IMonthyPayStatusItem[];
    startDate: string | null;
    status: string | null;
    constructor(_data: Partial<IPayStatusHistory>);
    init(): void;
}
