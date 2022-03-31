import { IPublicPartition, IPublicRecord } from '../../../_types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class PublicPartition extends Homogenize<Partial<IPublicPartition>> implements IPublicPartition {
    PublicRecord: IPublicRecord;
    constructor(_data: Partial<IPublicPartition>);
    init(): void;
}
