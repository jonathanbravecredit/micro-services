import { ISB168Frozen } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class SB168Frozen extends Homogenize<Partial<ISB168Frozen>> implements ISB168Frozen {
    equifax: boolean | null;
    experian: boolean | null;
    transunion: boolean | null;
    constructor(_data: Partial<ISB168Frozen>);
}
