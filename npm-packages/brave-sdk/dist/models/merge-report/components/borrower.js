"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrower = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const borrower_address_1 = require("./borrower-components/borrower-address");
const borrower_birth_1 = require("./borrower-components/borrower-birth");
const borrower_bureau_identifier_1 = require("./borrower-components/borrower-bureau-identifier");
const borrower_name_1 = require("./borrower-components/borrower-name");
const borrower_telephone_1 = require("./borrower-components/borrower-telephone");
const credit_score_1 = require("./borrower-components/credit-score");
const credit_statement_1 = require("./borrower-components/credit-statement");
const employer_1 = require("./borrower-components/employer");
const social_partition_1 = require("./borrower-components/social-partition");
class Borrower extends homogenize_data_1.Homogenize {
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
        this.BorrowerAddress = this.homogenizeArray(this.BorrowerAddress, borrower_address_1.BorrowerAddress);
        this.PreviousAddress = this.homogenizeArray(this.PreviousAddress, borrower_address_1.BorrowerAddress);
        this.Birth = this.homogenizeArray(this.Birth, borrower_birth_1.BorrowerBirth);
        this.CreditStatement = this.homogenizeArray(this.CreditStatement, credit_statement_1.CreditStatement);
        this.CreditScore = this.homogenizeArray(this.CreditScore, credit_score_1.CreditScore);
        this.Employer = this.homogenizeArray(this.Employer, employer_1.Employer);
        this.BorrowerName = this.homogenizeArray(this.BorrowerName, borrower_name_1.BorrowerName);
        this.BorrowerTelephone = this.homogenizeArray(this.BorrowerTelephone, borrower_telephone_1.BorrowerTelephone);
        this.SocialPartition = this.homogenizeArray(this.SocialPartition, social_partition_1.SocialPartition);
        this.BorrowerBureauIdentifier = this.homogenizeArray(this.BorrowerBureauIdentifier, borrower_bureau_identifier_1.BorrowerBureauIdentifier);
    }
}
exports.Borrower = Borrower;
