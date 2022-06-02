import {
  ISocial,
  ISocialPartition,
} from "@bravecredit/brave-sdk/dist/types/merge-report";
import { Homogenize } from "libs/utils/mergereport/Base/HomogenizeData";
import { Social } from "libs/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/Social";

export class SocialPartition
  extends Homogenize<Partial<ISocialPartition>>
  implements ISocialPartition
{
  Social: ISocial[] = [];

  constructor(_data: Partial<ISocialPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Social = this.homogenizeArray<ISocial, Social>(this.Social, Social);
  }
}
