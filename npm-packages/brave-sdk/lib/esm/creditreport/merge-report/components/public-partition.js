import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { PublicRecord } from './public-components/public-record';
export class PublicPartition extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.PublicRecord = new PublicRecord(this.PublicRecord);
    }
}
