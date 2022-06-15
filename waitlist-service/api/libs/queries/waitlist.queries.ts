import "reflect-metadata";
import { DynamoStore } from "@shiftcoders/dynamo-easy";
import { Waitlist } from "libs/models/waitlist.model";

export class WaitlistQueries {
  static store = new DynamoStore(Waitlist);
  constructor() {}

  static async getWaitlist(id: string): Promise<Waitlist | null> {
    return this.store.get(id).exec();
  }

  static async listWaitlists(): Promise<Waitlist[]> {
    return this.store.scan().execFetchAll();
  }

  static async createWaitlist(waitlist: Waitlist): Promise<void> {
    return this.store.put(waitlist).ifNotExists().exec();
  }

  static async updateWaitlist(waitlist: Waitlist): Promise<void> {
    return this.store.put(waitlist).exec();
  }
}
