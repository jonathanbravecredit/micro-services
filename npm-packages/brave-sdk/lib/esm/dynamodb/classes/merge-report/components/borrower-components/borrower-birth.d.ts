import { IDate, ISource } from '../../../../../_types/common-tu';
import { IBorrowerBirth } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
export declare class BorrowerBirth extends Homogenize<Partial<IBorrowerBirth>> implements IBorrowerBirth {
    BirthDate: IDate;
    Source: ISource;
    date: string | null;
    age: number | null;
    partitionSet: number | string | null;
    constructor(_data: Partial<IBorrowerBirth>);
    init(): void;
}
