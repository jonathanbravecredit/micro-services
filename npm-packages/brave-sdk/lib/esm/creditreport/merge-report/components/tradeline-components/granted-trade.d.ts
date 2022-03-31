import { ICodeRef } from '../../../../_types/common-tu';
import { IGrantedTrade, IPayStatusHistory } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class GrantedTrade extends Homogenize<Partial<IGrantedTrade>> implements IGrantedTrade {
    AccountType: ICodeRef;
    CreditType: ICodeRef;
    PaymentFrequency: ICodeRef;
    TermType: ICodeRef;
    WorstPayStatus: ICodeRef;
    PayStatusHistory: IPayStatusHistory;
    CreditLimit: number | string | null;
    monthsReviewed: number | string | null;
    monthlyPayment: number | string | null;
    late90Count: number | string | null;
    late60Count: number | string | null;
    late30Count: number | string | null;
    actualPaymentAmount: number | string | null;
    worstPatStatusCount: number | string | null;
    termMonths: number | string | null;
    dateLastPayment: string | null;
    collateral: string | null;
    amountPastDue: number | string | null;
    dateWorstPayStatus: string | null;
    datePastDue: string | null;
    constructor(_data: Partial<IGrantedTrade>);
    init(): void;
}
