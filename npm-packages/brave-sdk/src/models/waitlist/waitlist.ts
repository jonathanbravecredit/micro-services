import "reflect-metadata";
import { GSIPartitionKey, Model, PartitionKey } from "@shiftcoders/dynamo-easy";
import { v4 } from "uuid";

export const EMAIL_INDEX = "email-index";
export const PHONE_INDEX = "phone-index";

@Model({ tableName: "Waitlist" })
export class Waitlist {
  @PartitionKey()
  id!: string;

  firstName!: string;

  lastName!: string;

  @GSIPartitionKey(EMAIL_INDEX)
  email!: string;

  @GSIPartitionKey(PHONE_INDEX)
  phone!: string;

  referralCode!: string;

  referredByCode = "";
}

export class WaitlistMaker {
  public referralCode: string = v4();
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public referredByCode = "",
  ) {}
}
