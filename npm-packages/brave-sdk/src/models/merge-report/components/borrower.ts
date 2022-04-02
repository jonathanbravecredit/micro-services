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

export class Borrower extends Homogenize<Partial<Borrower>> {
  BorrowerAddress: BorrowerAddress[] = [];
  PreviousAddress: BorrowerAddress[] = [];
  Birth: BorrowerBirth[] = [];
  CreditStatement: CreditStatement[] = [];
  CreditScore: CreditScore[] = [];
  Employer: Employer[] = [];
  BorrowerName: BorrowerName[] = [];
  BorrowerTelephone: BorrowerTelephone[] = [];
  SocialPartition: SocialPartition[] = [];
  BorrowerBureauIdentifier: BorrowerBureauIdentifier[] = [];
  borrowerKey: string | null = null;
  SocialSecurityNumber: string | number | null = null;

  constructor(_data: Partial<Borrower>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BorrowerAddress = this.homogenizeArray<BorrowerAddress, BorrowerAddress>(
      this.BorrowerAddress,
      BorrowerAddress,
    );
    this.PreviousAddress = this.homogenizeArray<BorrowerAddress, BorrowerAddress>(
      this.PreviousAddress,
      BorrowerAddress,
    );
    this.Birth = this.homogenizeArray<BorrowerBirth, BorrowerBirth>(this.Birth, BorrowerBirth);
    this.CreditStatement = this.homogenizeArray<CreditStatement, CreditStatement>(
      this.CreditStatement,
      CreditStatement,
    );
    this.CreditScore = this.homogenizeArray<CreditScore, CreditScore>(this.CreditScore, CreditScore);
    this.Employer = this.homogenizeArray<Employer, Employer>(this.Employer, Employer);
    this.BorrowerName = this.homogenizeArray<BorrowerName, BorrowerName>(this.BorrowerName, BorrowerName);
    this.BorrowerTelephone = this.homogenizeArray<BorrowerTelephone, BorrowerTelephone>(
      this.BorrowerTelephone,
      BorrowerTelephone,
    );
    this.SocialPartition = this.homogenizeArray<SocialPartition, SocialPartition>(
      this.SocialPartition,
      SocialPartition,
    );
    this.BorrowerBureauIdentifier = this.homogenizeArray<BorrowerBureauIdentifier, BorrowerBureauIdentifier>(
      this.BorrowerBureauIdentifier,
      BorrowerBureauIdentifier,
    );
  }
}
