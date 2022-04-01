import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';
export class Social extends Homogenize {
    constructor(_data) {
        super(_data);
        this.SocialSecurityNumber = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new Source(this.Source);
    }
}
