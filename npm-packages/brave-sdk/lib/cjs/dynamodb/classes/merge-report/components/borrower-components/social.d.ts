import { ISource } from '../../../../../_types/common-tu';
import { ISocial } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class Social extends Homogenize<Partial<ISocial>> implements ISocial {
    SocialSecurityNumber: string | null;
    Source: ISource;
    constructor(_data: Partial<ISocial>);
    init(): void;
}
