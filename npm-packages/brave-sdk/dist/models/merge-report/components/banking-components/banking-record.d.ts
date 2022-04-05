import { ICodeRef, IRemark, ISource } from '../../../../types';
import { IBankingRecord } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class BankingRecord extends Homogenize<Partial<IBankingRecord>> implements IBankingRecord {
    BankingType: ICodeRef;
    AccountDesignator: ICodeRef;
    IndustryCode: ICodeRef;
    Status: ICodeRef;
    Remark: IRemark[];
    Source: ISource;
    dateOpened: string | null;
    dateClosed: string | null;
    bureau: string | null;
    dateVerified: string | null;
    subscriberCode: string | null;
    bankName: string | null;
    balance: number | string | null;
    accountNumber: string | null;
    constructor(_data: Partial<IBankingRecord>);
    init(): void;
}
