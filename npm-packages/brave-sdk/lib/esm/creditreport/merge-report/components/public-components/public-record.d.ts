import { ICodeRef, IRemark, ISource } from '../../../../_types/common-tu';
import { IPublicRecord, IMiscPublicRecord, IFinancingStatement, IGarnishment, IFinancialCounseling, IMaritalItem, IBankruptcy, IRegisteredItem, ITaxLien, ILegalItem, IForeclosure } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class PublicRecord extends Homogenize<Partial<IPublicRecord>> implements IPublicRecord {
    AccountDesignator: ICodeRef;
    Classification: ICodeRef;
    IndustryCode: ICodeRef;
    Status: ICodeRef;
    Type: ICodeRef;
    MiscPublicRecord: IMiscPublicRecord;
    FinancingStatement: IFinancingStatement;
    Garnishment: IGarnishment;
    FinancialCounseling: IFinancialCounseling;
    MaritalItem: IMaritalItem;
    Bankruptcy: IBankruptcy;
    RegisteredItem: IRegisteredItem;
    TaxLien: ITaxLien;
    LegalItem: ILegalItem;
    Foreclosure: IForeclosure;
    Remark: IRemark[];
    Source: ISource;
    ExpirationDate: string | null;
    subscriberCode: string | null;
    referenceNumber: string | null;
    handle: string | null;
    bureau: string | null;
    dateFiled: string | null;
    courtName: string | null;
    dateVerified: string | null;
    dateUpdated: string | null;
    constructor(_data: Partial<IPublicRecord>);
    init(): void;
}
