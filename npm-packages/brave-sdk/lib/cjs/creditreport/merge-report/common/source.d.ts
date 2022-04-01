import { ISource, ICodeRef } from '../../../_types/common-tu';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Source extends Homogenize<Partial<ISource>> implements ISource {
    BorrowerKey: string | null;
    Bureau: ICodeRef;
    InquiryDate: string | null;
    Reference: string | null;
    constructor(_data: Partial<ISource>);
    init(): void;
}
