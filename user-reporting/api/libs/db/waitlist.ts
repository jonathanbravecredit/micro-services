import { IBatchMsg } from "@bravecredit/brave-sdk";
import { AttributeValue } from "aws-lambda";
import { pScan } from "libs/db/generic";
import { IAttributeValue } from "libs/interfaces/batch.interfaces";

export const parallelScanWaitlist = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  try {
    return await pScan(esk, segment, totalSegments, { table: "Waitlist" });
  } catch (err) {
    console.log("err ==> ", err);
  }
};
