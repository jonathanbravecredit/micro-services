import { IBankingPartition, IBankingRecord } from '../../../../_types/merge-report';
import { Homogenize } from '../../homogenize/homogenize-data';
export declare class BankingPartition extends Homogenize<Partial<IBankingPartition>> implements IBankingPartition {
    BankingRecord: IBankingRecord[];
    constructor(_data: Partial<IBankingPartition>);
    init(): void;
}
