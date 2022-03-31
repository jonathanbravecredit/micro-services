import { ISocialPartition, ISocial } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class SocialPartition extends Homogenize<Partial<ISocialPartition>> implements ISocialPartition {
    Social: ISocial[];
    constructor(_data: Partial<ISocialPartition>);
    init(): void;
}
