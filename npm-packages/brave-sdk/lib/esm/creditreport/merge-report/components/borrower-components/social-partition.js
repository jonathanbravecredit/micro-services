import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Social } from './social';
export class SocialPartition extends Homogenize {
    constructor(_data) {
        super(_data);
        this.Social = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Social = this.homogenizeArray(this.Social, Social);
    }
}
