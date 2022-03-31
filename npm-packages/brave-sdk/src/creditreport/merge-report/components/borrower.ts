import {
  IBorrower,
  IBorrowerAddress,
  IBorrowerBirth,
  ICreditStatement,
  ICreditScore,
  IEmployer,
  IBorrowerName,
  IBorrowerTelephone,
  ISocialPartition,
  IBorrowerBureauIdentifier,
} from '../../../_types/merge-report';
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

export class Borrower extends Homogenize<Partial<IBorrower>> implements IBorrower {
  BorrowerAddress: IBorrowerAddress[] = [];
  PreviousAddress: IBorrowerAddress[] = [];
  Birth: IBorrowerBirth[] = [];
  CreditStatement: ICreditStatement[] = [];
  CreditScore: ICreditScore[] = [];
  Employer: IEmployer[] = [];
  BorrowerName: IBorrowerName[] = [];
  BorrowerTelephone: IBorrowerTelephone[] = [];
  SocialPartition: ISocialPartition[] = [];
  BorrowerBureauIdentifier: IBorrowerBureauIdentifier[] = [];
  borrowerKey: string | null = null;
  SocialSecurityNumber: string | number | null = null;

  constructor(_data: Partial<IBorrower>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BorrowerAddress = this.homogenizeArray<IBorrowerAddress, BorrowerAddress>(
      this.BorrowerAddress,
      BorrowerAddress,
    );
    this.PreviousAddress = this.homogenizeArray<IBorrowerAddress, BorrowerAddress>(
      this.PreviousAddress,
      BorrowerAddress,
    );
    this.Birth = this.homogenizeArray<IBorrowerBirth, BorrowerBirth>(this.Birth, BorrowerBirth);
    this.CreditStatement = this.homogenizeArray<ICreditStatement, CreditStatement>(
      this.CreditStatement,
      CreditStatement,
    );
    this.CreditScore = this.homogenizeArray<ICreditScore, CreditScore>(this.CreditScore, CreditScore);
    this.Employer = this.homogenizeArray<IEmployer, Employer>(this.Employer, Employer);
    this.BorrowerName = this.homogenizeArray<IBorrowerName, BorrowerName>(this.BorrowerName, BorrowerName);
    this.BorrowerTelephone = this.homogenizeArray<IBorrowerTelephone, BorrowerTelephone>(
      this.BorrowerTelephone,
      BorrowerTelephone,
    );
    this.SocialPartition = this.homogenizeArray<ISocialPartition, SocialPartition>(
      this.SocialPartition,
      SocialPartition,
    );
    this.BorrowerBureauIdentifier = this.homogenizeArray<IBorrowerBureauIdentifier, BorrowerBureauIdentifier>(
      this.BorrowerBureauIdentifier,
      BorrowerBureauIdentifier,
    );
  }
}
