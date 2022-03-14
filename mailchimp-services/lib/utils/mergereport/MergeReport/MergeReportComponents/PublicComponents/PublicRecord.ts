import { ICodeRef, IRemark, ISource } from 'lib/interfaces/common.interface';
import {
  IBankruptcy,
  IFinancialCounseling,
  IFinancingStatement,
  IForeclosure,
  IGarnishment,
  ILegalItem,
  IMaritalItem,
  IMiscPublicRecord,
  IPublicRecord,
  IRegisteredItem,
  ITaxLien,
} from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';
import { Remark } from 'lib/utils/mergereport/Common/Remark';
import { Source } from 'lib/utils/mergereport/Common/Source';
import { LegalItem } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/LegalItem';
import { Bankruptcy } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/Bankruptcy';
import { FinancialCounseling } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/FinancialCounseling';
import { FinancingStatement } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/FinancingStatement';
import { Foreclosure } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/Foreclosure';
import { Garnishment } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/Garnishment';
import { MaritalItem } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/MaritalItem';
import { MiscPublicRecord } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/MiscPublicRecord';
import { RegisteredItem } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/RegisteredItem';
import { TaxLien } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/TaxLien';

export class PublicRecord extends Homogenize<Partial<IPublicRecord>> implements IPublicRecord {
  AccountDesignator!: ICodeRef;
  Classification!: ICodeRef;
  IndustryCode!: ICodeRef;
  Status!: ICodeRef;
  Type!: ICodeRef;
  MiscPublicRecord!: IMiscPublicRecord;
  FinancingStatement!: IFinancingStatement;
  Garnishment!: IGarnishment;
  FinancialCounseling!: IFinancialCounseling;
  MaritalItem!: IMaritalItem;
  Bankruptcy!: IBankruptcy;
  RegisteredItem!: IRegisteredItem;
  TaxLien!: ITaxLien;
  LegalItem!: ILegalItem;
  Foreclosure!: IForeclosure;
  Remark: IRemark[] = [];
  Source!: ISource;
  ExpirationDate: string | null = null;
  subscriberCode: string | null = null;
  referenceNumber: string | null = null;
  handle: string | null = null;
  bureau: string | null = null;
  dateFiled: string | null = null;
  courtName: string | null = null;
  dateVerified: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IPublicRecord>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.AccountDesignator = new CodeRef(this.AccountDesignator);
    this.Classification = new CodeRef(this.Classification);
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Status = new CodeRef(this.Status);
    this.Type = new CodeRef(this.Type);
    this.MiscPublicRecord = new MiscPublicRecord(this.MiscPublicRecord);
    this.FinancingStatement = new FinancingStatement(this.FinancingStatement);
    this.Garnishment = new Garnishment(this.Garnishment);
    this.FinancialCounseling = new FinancialCounseling(this.FinancialCounseling);
    this.MaritalItem = new MaritalItem(this.MaritalItem);
    this.Bankruptcy = new Bankruptcy(this.Bankruptcy);
    this.RegisteredItem = new RegisteredItem(this.RegisteredItem);
    this.TaxLien = new TaxLien(this.TaxLien);
    this.LegalItem = new LegalItem(this.LegalItem);
    this.Foreclosure = new Foreclosure(this.Foreclosure);
    this.Remark = this.homogenizeArray<IRemark, Remark>(this.Remark, Remark);
    this.Source = new Source(this.Source);
  }
}
