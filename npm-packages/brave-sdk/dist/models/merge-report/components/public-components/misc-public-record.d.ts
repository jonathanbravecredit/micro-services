import { IMiscPublicRecord } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class MiscPublicRecord extends Homogenize<Partial<IMiscPublicRecord>> implements IMiscPublicRecord {
    miscInformation: string | null;
    constructor(_data: Partial<IMiscPublicRecord>);
}
