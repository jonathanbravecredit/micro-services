import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { BorrowerAddress } from './borrower-components/borrower-address';
import { BorrowerBirth } from './borrower-components/borrower-birth';
import { BorrowerBureauIdentifier } from './borrower-components/borrower-bureau-identifier';
import { BorrowerName } from './borrower-components/borrower-name';
import { BorrowerTelephone } from './borrower-components/borrower-telephone';
import { CreditScore } from './borrower-components/credit-score';
import { CreditStatement } from './borrower-components/credit-statement';
import { Employer } from './borrower-components/employer';
import { SocialPartition } from './borrower-components/social-partition';
export class Borrower extends Homogenize {
    constructor(_data) {
        super(_data);
        this.BorrowerAddress = [];
        this.PreviousAddress = [];
        this.Birth = [];
        this.CreditStatement = [];
        this.CreditScore = [];
        this.Employer = [];
        this.BorrowerName = [];
        this.BorrowerTelephone = [];
        this.SocialPartition = [];
        this.BorrowerBureauIdentifier = [];
        this.borrowerKey = null;
        this.SocialSecurityNumber = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BorrowerAddress = this.homogenizeArray(this.BorrowerAddress, BorrowerAddress);
        this.PreviousAddress = this.homogenizeArray(this.PreviousAddress, BorrowerAddress);
        this.Birth = this.homogenizeArray(this.Birth, BorrowerBirth);
        this.CreditStatement = this.homogenizeArray(this.CreditStatement, CreditStatement);
        this.CreditScore = this.homogenizeArray(this.CreditScore, CreditScore);
        this.Employer = this.homogenizeArray(this.Employer, Employer);
        this.BorrowerName = this.homogenizeArray(this.BorrowerName, BorrowerName);
        this.BorrowerTelephone = this.homogenizeArray(this.BorrowerTelephone, BorrowerTelephone);
        this.SocialPartition = this.homogenizeArray(this.SocialPartition, SocialPartition);
        this.BorrowerBureauIdentifier = this.homogenizeArray(this.BorrowerBureauIdentifier, BorrowerBureauIdentifier);
    }
}
