import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Session, USERID_SESSIONDATE_INDEX } from '../models/session.model';

export class SessionQueries {
  static store = new DynamoStore(Session);
  constructor() {}

  static async createSession(Sessions: Session): Promise<void> {
    return this.store.put(Sessions).ifNotExists().exec();
  }

  static async listUserSessions(userId: string, limit: number = 50): Promise<Session[]> {
    return this.store.query().wherePartitionKey(userId).limit(20).execFetchAll();
  }

  static async getSession(sub: string, sessionId: string): Promise<Session | null> {
    return this.store
      .get(sub, sessionId)
      .exec()
      .then((res) => res)
      .catch((err) => err);
  }

  static async getLatestSession(userId: any, sort: string = 'desc', limit: number = 1): Promise<Session[]> {
    if (sort === 'desc') {
      return this.store
        .query()
        .index(USERID_SESSIONDATE_INDEX)
        .wherePartitionKey(userId)
        .descending()
        .limit(limit)
        .execFetchAll();
    } else {
      return this.store
        .query()
        .index(USERID_SESSIONDATE_INDEX)
        .wherePartitionKey(userId)
        .ascending()
        .limit(limit)
        .execFetchAll();
    }
  }

  static async incrementSessionPageViews(session: Partial<Session>, increment: number = 0): Promise<void> {
    const { userId, sessionId } = session;
    if (!userId || !sessionId) return;
    return this.store.update(userId, sessionId).updateAttribute('pageViews').incrementBy(increment).exec();
  }

  static async incrementSessionClickEvents(session: Partial<Session>, increment: number = 0): Promise<void> {
    const { userId, sessionId } = session;
    if (!userId || !sessionId) return;
    return this.store.update(userId, sessionId).updateAttribute('clickEvents').incrementBy(increment).exec();
  }
}
