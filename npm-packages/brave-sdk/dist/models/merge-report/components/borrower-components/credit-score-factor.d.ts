import { ICodeRef } from '../../../../types';
import { ICreditScoreFactor } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class CreditScoreFactor extends Homogenize<Partial<ICreditScoreFactor>> implements ICreditScoreFactor {
    Factor: ICodeRef;
    FactorText: string[];
    FactorType: 'Negative' | 'Positive' | null;
    bureauCode: number | null;
    constructor(_data: Partial<ICreditScoreFactor>);
    init(): void;
}
