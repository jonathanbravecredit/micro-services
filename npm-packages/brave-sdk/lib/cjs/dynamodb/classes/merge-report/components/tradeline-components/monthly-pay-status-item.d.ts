import { ICodeRef } from '../../../../../_types/common-tu';
import { IMonthyPayStatusItem } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class MonthlyPayStatusItem extends Homogenize<Partial<IMonthyPayStatusItem>> implements IMonthyPayStatusItem {
    GenericRemark: ICodeRef;
    RatingRemark: ICodeRef;
    ComplianceRemark: ICodeRef;
    PaymentDue: number | string | null;
    CreditLimit: number | string | null;
    ActualPayment: number | string | null;
    PastDue: number | string | null;
    highCredit: number | string | null;
    status: string | null;
    date: string | null;
    currentBalance: number | string | null;
    changed: boolean | string | null;
    constructor(_data: Partial<IMonthyPayStatusItem>);
    init(): void;
}
