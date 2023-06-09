import { ICodeRef } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class CodeRef extends Homogenize<Partial<ICodeRef>> implements ICodeRef {
  abbreviation: string | null = null;
  description: string | null = null;
  symbol: number | string | null = null;
  rank: number | string | null = null;

  constructor(_data: Partial<ICodeRef>) {
    super(_data);
    this.homogenize(_data);
  }
}
