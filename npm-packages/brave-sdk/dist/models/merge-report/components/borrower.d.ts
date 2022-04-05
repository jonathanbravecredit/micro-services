import { IBorrower, IBorrowerAddress, IBorrowerBirth, ICreditStatement, ICreditScore, IEmployer, IBorrowerName, IBorrowerTelephone, ISocialPartition, IBorrowerBureauIdentifier } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Borrower extends Homogenize<Partial<IBorrower>> implements IBorrower {
    BorrowerAddress: IBorrowerAddress[];
    PreviousAddress: IBorrowerAddress[];
    Birth: IBorrowerBirth[];
    CreditStatement: ICreditStatement[];
    CreditScore: ICreditScore[];
    Employer: IEmployer[];
    BorrowerName: IBorrowerName[];
    BorrowerTelephone: IBorrowerTelephone[];
    SocialPartition: ISocialPartition[];
    BorrowerBureauIdentifier: IBorrowerBureauIdentifier[];
    borrowerKey: string | null;
    SocialSecurityNumber: string | number | null;
    constructor(_data: Partial<IBorrower>);
    init(): void;
}
