import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { BankingRecord } from './banking-components/banking-record';
export class BankingPartition extends Homogenize {
    constructor(_data) {
        super(_data);
        this.BankingRecord = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BankingRecord = this.homogenizeArray(this.BankingRecord, BankingRecord);
    }
}
