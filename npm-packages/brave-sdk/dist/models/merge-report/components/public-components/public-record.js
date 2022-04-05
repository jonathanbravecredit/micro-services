"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRecord = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const remark_1 = require("../../common/remark");
const source_1 = require("../../common/source");
const bankruptcy_1 = require("./bankruptcy");
const financial_counseling_1 = require("./financial-counseling");
const financing_statement_1 = require("./financing-statement");
const foreclosure_1 = require("./foreclosure");
const garnishment_1 = require("./garnishment");
const legal_item_1 = require("./legal-item");
const marital_item_1 = require("./marital-item");
const misc_public_record_1 = require("./misc-public-record");
const registered_item_1 = require("./registered-item");
const tax_lien_1 = require("./tax-lien");
class PublicRecord extends homogenize_data_1.Homogenize {
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
        this.AccountDesignator = new code_ref_1.CodeRef(this.AccountDesignator);
        this.Classification = new code_ref_1.CodeRef(this.Classification);
        this.IndustryCode = new code_ref_1.CodeRef(this.IndustryCode);
        this.Status = new code_ref_1.CodeRef(this.Status);
        this.Type = new code_ref_1.CodeRef(this.Type);
        this.MiscPublicRecord = new misc_public_record_1.MiscPublicRecord(this.MiscPublicRecord);
        this.FinancingStatement = new financing_statement_1.FinancingStatement(this.FinancingStatement);
        this.Garnishment = new garnishment_1.Garnishment(this.Garnishment);
        this.FinancialCounseling = new financial_counseling_1.FinancialCounseling(this.FinancialCounseling);
        this.MaritalItem = new marital_item_1.MaritalItem(this.MaritalItem);
        this.Bankruptcy = new bankruptcy_1.Bankruptcy(this.Bankruptcy);
        this.RegisteredItem = new registered_item_1.RegisteredItem(this.RegisteredItem);
        this.TaxLien = new tax_lien_1.TaxLien(this.TaxLien);
        this.LegalItem = new legal_item_1.LegalItem(this.LegalItem);
        this.Foreclosure = new foreclosure_1.Foreclosure(this.Foreclosure);
        this.Remark = this.homogenizeArray(this.Remark, remark_1.Remark);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.PublicRecord = PublicRecord;
