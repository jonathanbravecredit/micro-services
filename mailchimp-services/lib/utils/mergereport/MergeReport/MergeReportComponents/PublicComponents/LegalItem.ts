import { ICodeRef } from 'lib/interfaces/common.interface';
import { ILegalItem } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

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