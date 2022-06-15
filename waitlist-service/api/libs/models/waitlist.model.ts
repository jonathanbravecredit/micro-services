import "reflect-metadata";
import { GSIPartitionKey, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

export const EMAIL_INDEX = "email-index";
export const PHONE_INDEX = "phone-index";

@Model({ tableName: "Referrals" })
export class Waitlist {
  @PartitionKey()
  id!: string;

  firstName!: string;

  lastName!: string;

  @GSIPartitionKey(EMAIL_INDEX)
  email!: string;

  @GSIPartitionKey(PHONE_INDEX)
  phone!: string;
}
