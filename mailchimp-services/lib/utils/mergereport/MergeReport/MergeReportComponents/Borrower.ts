import {
  IBorrower,
  IBorrowerAddress,
  IBorrowerBirth,
  IBorrowerBureauIdentifier,
  IBorrowerName,
  IBorrowerTelephone,
  ICreditScore,
  ICreditStatement,
  IEmployer,
  ISocialPartition,
} from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { BorrowerAddress } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerAddress';
import { BorrowerBirth } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerBirth';
import { BorrowerBureauIdentifier } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerBureauIdentifier';
import { BorrowerName } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerName';
import { BorrowerTelephone } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerTelephone';
import { CreditScore } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/CreditScore';
import { CreditStatement } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/CreditStatement';
import { Employer } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/Employer';
import { SocialPartition } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/SocialPartition';

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
