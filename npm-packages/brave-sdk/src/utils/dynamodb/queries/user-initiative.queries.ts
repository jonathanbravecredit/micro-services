import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { UserInitiative } from '../../../models/user-initiative/user-initiative';

export class UserInitiativeQueries {
  static store = new DynamoStore(UserInitiative);
  constructor() {}

  static async getInitiative(id: string, program: string): Promise<UserInitiative> {
    return this.store
      .get(id, program)
      .exec()
      .then((res) => res)
      .catch((err) => err);
  }

  static async createInitiative(initiative: UserInitiative): Promise<void> {
    const createdOn = new Date().toISOString();
    const userInitiative = {
      ...initiative,
      createdOn,
      modifiedOn: createdOn,
    };
    return this.store.put(userInitiative).exec();
  }

  static async updateInitiative(initiative: UserInitiative): Promise<void> {
    const modifiedOn = new Date().toISOString();
    const userInitiative = {
      ...initiative,
      modifiedOn,
    };
    return this.store.put(userInitiative).exec();
  }

  static async getFutureScoreInitiative(): Promise<UserInitiative> {
    return this.getInitiative('bravecredit', '1');
  }

  static async getPrograms(programId: string): Promise<UserInitiative> {
    return this.getInitiative('bravecredit', programId);
  }
}
