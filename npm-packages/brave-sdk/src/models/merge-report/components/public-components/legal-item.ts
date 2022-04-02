import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class LegalItem extends Homogenize<Partial<LegalItem>> {
  CourtLocation!: CodeRef;
  CourtType!: CodeRef;
  plaintiff: string | null = null;
  lawyer: string | null = null;
  thirdParty: string | null = null;
  actionAmount: number | string | null = null;
  balance: number | string | null = null;
  dateSatisfied: string | null = null;

  constructor(_data: Partial<LegalItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CourtLocation = new CodeRef(this.CourtLocation);
    this.CourtType = new CodeRef(this.CourtType);
  }
}
