import { ICodeRef } from '../../../../../_types/common-tu';
import { IFinancingStatement } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class FinancingStatement extends Homogenize<Partial<IFinancingStatement>> implements IFinancingStatement {
    CreditorType: ICodeRef;
    dateMaturity: string | null;
    constructor(_data: Partial<IFinancingStatement>);
    init(): void;
}
