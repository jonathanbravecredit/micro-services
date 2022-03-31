import { Homogenize } from '../../homogenize/homogenize-data';
import { Tradeline } from './tradeline-components/tradeline';
export class TradeLinePartition extends Homogenize {
    constructor(_data) {
        super(_data);
        this.accountTypeDescription = null;
        this.accountTypeSymbol = null;
        this.accountTypeAbbreviation = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Tradeline = new Tradeline(this.Tradeline);
    }
}
