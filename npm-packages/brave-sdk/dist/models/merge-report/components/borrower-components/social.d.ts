import { ISource } from '../../../../types';
import { ISocial } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export declare class Social extends Homogenize<Partial<ISocial>> implements ISocial {
    SocialSecurityNumber: string | null;
    Source: ISource;
    constructor(_data: Partial<ISocial>);
    init(): void;
}
