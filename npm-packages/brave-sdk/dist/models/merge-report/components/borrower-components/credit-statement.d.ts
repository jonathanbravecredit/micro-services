import { ICodeRef, ISource } from '../../../../types';
import { ICreditStatement } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class CreditStatement extends Homogenize<Partial<ICreditStatement>> implements ICreditStatement {
    StatementType: ICodeRef;
    Source: ISource;
    statement: string | null;
    constructor(_data: Partial<ICreditStatement>);
    init(): void;
}
