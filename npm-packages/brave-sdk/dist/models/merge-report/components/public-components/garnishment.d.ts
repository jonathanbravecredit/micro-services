import { IGarnishment } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Garnishment extends Homogenize<Partial<IGarnishment>> implements IGarnishment {
    amount: number | string | null;
    dateSatisfied: string | null;
    garnishee: string | null;
    plaintiff: string | null;
    constructor(_data: Partial<IGarnishment>);
}
