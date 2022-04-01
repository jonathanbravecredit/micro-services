import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Remark } from '../../common/remark';
import { Source } from '../../common/source';
import { CollectionTrade } from './collection-trade';
import { GrantedTrade } from './granted-trade';
import { WatchTrade } from './watch-trade';
export class Tradeline extends Homogenize {
    constructor(_data) {
        super(_data);
        this.subscriberCode = null;
        this.highBalance = null;
        this.dateVerified = null;
        this.handle = null;
        this.bureau = null;
        this.position = null;
        this.dateReported = null;
        this.currentBalance = null;
        this.creditorName = null;
        this.accountNumber = null;
        this.dateOpened = null;
        this.dateClosed = null;
        this.dateAccountStatus = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.AccountCondition = new CodeRef(this.AccountCondition);
        this.AccountDesignator = new CodeRef(this.AccountDesignator);
        this.DisputeFlag = new CodeRef(this.DisputeFlag);
        this.IndustryCode = new CodeRef(this.IndustryCode);
        this.OpenClosed = new CodeRef(this.OpenClosed);
        this.PayStatus = new CodeRef(this.PayStatus);
        this.VerificationIndicator = new CodeRef(this.VerificationIndicator);
        this.Remark = this.homogenizeArray(this.Remark, Remark);
        this.WatchTrade = new WatchTrade(this.WatchTrade);
        this.GrantedTrade = new GrantedTrade(this.GrantedTrade);
        this.CollectionTrade = new CollectionTrade(this.CollectionTrade);
        this.Source = new Source(this.Source);
    }
}
