import { IBatchMsg } from "@bravecredit/brave-sdk";
import { AttributeValue } from "aws-lambda";
import { pScan } from "libs/db/generic";
import { IAttributeValue } from "libs/interfaces/batch.interfaces";

export const parallelScan = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
  table: string | undefined
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  try {
    return await pScan(esk, segment, totalSegments, { table: table || "" });
  } catch (err) {
    console.log("err ==> ", err);
  }
};
