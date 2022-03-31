import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Remark } from '../../common/remark';
import { Source } from '../../common/source';
import { Bankruptcy } from './bankruptcy';
import { FinancialCounseling } from './financial-counseling';
import { FinancingStatement } from './financing-statement';
import { Foreclosure } from './foreclosure';
import { Garnishment } from './garnishment';
import { LegalItem } from './legal-item';
import { MaritalItem } from './marital-item';
import { MiscPublicRecord } from './misc-public-record';
import { RegisteredItem } from './registered-item';
import { TaxLien } from './tax-lien';
export class PublicRecord extends Homogenize {
    constructor(_data) {
        super(_data);
        this.Remark = [];
        this.ExpirationDate = null;
        this.subscriberCode = null;
        this.referenceNumber = null;
        this.handle = null;
        this.bureau = null;
        this.dateFiled = null;
        this.courtName = null;
        this.dateVerified = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
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
        this.Remark = this.homogenizeArray(this.Remark, Remark);
        this.Source = new Source(this.Source);
    }
}
