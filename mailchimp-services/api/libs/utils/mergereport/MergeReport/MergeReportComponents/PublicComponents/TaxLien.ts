import { ITaxLien } from "@bravecredit/brave-sdk/dist/types/merge-report";
import { Homogenize } from "libs/utils/mergereport/Base/HomogenizeData";

export class TaxLien extends Homogenize<Partial<ITaxLien>> implements ITaxLien {
  amount: number | string | null = null;
  dateReleased: string | null = null;

  constructor(_data: Partial<ITaxLien>) {
    super(_data);
    this.homogenize(_data);
  }
}
