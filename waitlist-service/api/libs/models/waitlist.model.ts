import "reflect-metadata";
import { Model, PartitionKey } from "@shiftcoders/dynamo-easy";

@Model({ tableName: "Referrals" })
export class Waitlist {
  @PartitionKey()
  id!: string;

  firstName!: string;

  lastName!: string;

  email!: string;

  phone!: string;
}
