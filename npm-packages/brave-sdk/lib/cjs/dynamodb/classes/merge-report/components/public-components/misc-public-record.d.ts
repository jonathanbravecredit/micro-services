import { IMiscPublicRecord } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class MiscPublicRecord extends Homogenize<Partial<IMiscPublicRecord>> implements IMiscPublicRecord {
    miscInformation: string | null;
    constructor(_data: Partial<IMiscPublicRecord>);
}
