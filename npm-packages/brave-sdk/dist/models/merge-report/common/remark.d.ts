import { IRemark, ICodeRef } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Remark extends Homogenize<Partial<IRemark>> implements IRemark {
    RemarkCode: ICodeRef;
    customRemark: string | null;
    constructor(_data: Partial<IRemark>);
    init(): void;
}
