import { ICodeRef } from '../../../../types';
import { IFinancingStatement } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class FinancingStatement extends Homogenize<Partial<IFinancingStatement>> implements IFinancingStatement {
    CreditorType: ICodeRef;
    dateMaturity: string | null;
    constructor(_data: Partial<IFinancingStatement>);
    init(): void;
}
