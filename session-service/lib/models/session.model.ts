import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

export const USERID_SESSIONDATE_INDEX = 'userIdSessionDate-index';

@Model({ tableName: 'Sessions' })
export class Session {
  @GSIPartitionKey(USERID_SESSIONDATE_INDEX)
  @PartitionKey()
  userId!: string;
  @SortKey()
  sessionId!: string;
  @GSISortKey(USERID_SESSIONDATE_INDEX)
  sessionDate!: string;
  sessionExpirationDate!: string;
  pageViews!: number;
}

export class SessionMaker implements Session {
  userId: string;
  sessionId: string;
  sessionDate: string;
  sessionExpirationDate: string;
  pageViews: number;

  constructor(
    userId: string,
    sessionId: string,
    sessionDate: string,
    sessionExpirationDate: string,
    pageViews: number,
  ) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.sessionDate = sessionDate;
    this.sessionExpirationDate = sessionExpirationDate;
    this.pageViews = pageViews;
  }
}
