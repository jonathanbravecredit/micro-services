import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Session, USERID_SESSIONDATE_INDEX } from 'lib/models/session.model';

const store = new DynamoStore(Session);

export const getSession = (sub: string, sessionId: string): Promise<Session | null> => {
  return store
    .get(sub, sessionId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getLatestSession = (userId: any, sort: string = 'desc', limit: string = '1'): Promise<Session | null> => {
  if (sort === 'desc') {
    return store
      .query()
      .index(USERID_SESSIONDATE_INDEX)
      .wherePartitionKey(userId)
      .descending()
      .limit(+limit)
      .execFetchAll()
      .then((res) => res)
      .catch((err) => err);
  } else {
    return store
      .query()
      .index(USERID_SESSIONDATE_INDEX)
      .wherePartitionKey(userId)
      .ascending()
      .limit(+limit)
      .execFetchAll()
      .then((res) => res)
      .catch((err) => err);
  }
};

export const listUserSessions = async (userId: string, limit: number = 50): Promise<Session[]> => {
  return store
    .query()
    .wherePartitionKey(userId)
    .limit(20)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createSession = (Sessions: Session): Promise<void> => {
  return store
    .put(Sessions)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateSession = async (
  session: Partial<Session>,
  keyPageIncrement: number = 0,
): Promise<Partial<Session> | null> => {
  if (!session.userId || !session.sessionId) return null;
  const old = await getSession(session.userId, session.sessionId);
  if (!old) return null;
  const merge = {
    ...old,
    ...session,
  };
  return store
    .update(merge.userId)
    .updateAttribute('sessionId')
    .set(merge.sessionId)
    .updateAttribute('sessionDate')
    .set(merge.sessionDate)
    .updateAttribute('sessionExpirationDate')
    .set(merge.sessionExpirationDate)
    .updateAttribute('pageViews')
    .set(merge.pageViews + keyPageIncrement)
    .returnValues('UPDATED_NEW')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
