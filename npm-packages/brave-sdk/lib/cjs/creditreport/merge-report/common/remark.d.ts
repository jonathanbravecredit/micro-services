import { IRemark, ICodeRef } from '../../../_types/common-tu';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Remark extends Homogenize<Partial<IRemark>> implements IRemark {
    RemarkCode: ICodeRef;
    customRemark: string | null;
    constructor(_data: Partial<IRemark>);
    init(): void;
}
