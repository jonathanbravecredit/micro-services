import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Remark } from '../../common/remark';
import { Source } from '../../common/source';
export class BankingRecord extends Homogenize {
    constructor(_data) {
        super(_data);
        this.Remark = [];
        this.dateOpened = null;
        this.dateClosed = null;
        this.bureau = null;
        this.dateVerified = null;
        this.subscriberCode = null;
        this.bankName = null;
        this.balance = null;
        this.accountNumber = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BankingType = new CodeRef(this.BankingType);
        this.AccountDesignator = new CodeRef(this.AccountDesignator);
        this.IndustryCode = new CodeRef(this.IndustryCode);
        this.Status = new CodeRef(this.Status);
        this.Remark = this.homogenizeArray(this.Remark, Remark);
        this.Source = new Source(this.Source);
    }
}
