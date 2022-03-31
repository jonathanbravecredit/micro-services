import { ICodeRef } from '../../../../../_types/common-tu';
import { ILegalItem } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class LegalItem extends Homogenize<Partial<ILegalItem>> implements ILegalItem {
  CourtLocation!: ICodeRef;
  CourtType!: ICodeRef;
  plaintiff: string | null = null;
  lawyer: string | null = null;
  thirdParty: string | null = null;
  actionAmount: number | string | null = null;
  balance: number | string | null = null;
  dateSatisfied: string | null = null;

  constructor(_data: Partial<ILegalItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CourtLocation = new CodeRef(this.CourtLocation);
    this.CourtType = new CodeRef(this.CourtType);
  }
}
