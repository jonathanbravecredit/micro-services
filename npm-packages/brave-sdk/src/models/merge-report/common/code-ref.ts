import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class CodeRef extends Homogenize<Partial<CodeRef>> {
  abbreviation: string | null = null;
  description: string | null = null;
  symbol: number | string | null = null;
  rank: number | string | null = null;

  constructor(_data: Partial<CodeRef>) {
    super(_data);
    this.homogenize(_data);
  }
}
